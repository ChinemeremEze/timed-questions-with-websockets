<!--StAuth10065: I Ezeakudolu Chinemeren David, 000778050 certify that this material is my original work. 
No other person's work has been used without due acknowledgement. 
I have not made my work available to anyone else.-->
<template>
  <div class="student">
    <h1>Student</h1>
    <p>Answer questions posed by the teacher</p>

    <form>
      <div class="row">
        <div class="col-6">
          <h4>Status</h4>
          <div>{{ statusText }}</div>
        </div>
      </div>

      <div class="dialog" v-if="answerTime == 0">
        <div class="col-6">
          <h4>Leaderboard</h4>
          <div v-if="leaderboardScores.length == 0">No scores recorded yet</div>
          <div v-else>
            <div v-for="score in leaderboardScores" :key="score.name">
              <div class="row">
                <div class="col-10">{{ score.name }}</div>
                <div class="col-2">{{ score.score }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog" v-else-if="!isReady">
        <div class="content">
          <h4>Please enter your name</h4>
          <input type="text" v-model="studentName" placeholder="John Smith">
          <button @click.prevent="startSession">Start</button>
        </div>
      </div>

      <div class="question" v-else-if="activeQuestion && answerTime !=0 && gotQuestion">
        <div class="content">
          <div v-if="isMultiple">
            <h3>Multiple Choice</h3>
            <p> {{activeQuestion.questionScore}} Points</p>
            <p class="timer">{{answerTime}}</p>
            <h1> {{activeQuestion.questionContent.question}} </h1>
            <div v-for="answer in activeQuestion.questionContent.answers" :key="answer.text">
              
              <input type="checkbox" v-model="answers" :value="answer" @change="changed"/>
              <label>{{answer.text}}</label>
            </div>
            <div class="row" v-if="isAnswered">
            <div class="col-12">
              <button @click.prevent="sendAnswerToTeacher">Submit Answer</button>
            </div>
          </div>
          </div>
          <div v-else>
            <p>Mactching Pairs</p>
          </div>

        </div>
      </div>
        <div class="question" v-else-if="isCorrect && answerTime !=0"> 
          <div class="content">
           <h2>Results</h2>
           <p class="timer">{{answerTime}}</p>
           <h1>Correct Answer!</h1>
           <div>
             <p>Your current score</p>
             <h1>{{activeQuestion.questionScore}} </h1>
           </div>
          </div>
        </div>
        <div class="question" v-else-if="isCorrect==false && answerTime !=0"> 
          <div class="content">
           <h2>Results</h2>
           <p class="timer">{{answerTime}}</p>
           <h1 class="incorrect">Incorrect Answer!</h1>
           <div>
             <p>Your current score</p>
             <h1>{{activeQuestion.questionScore}} </h1>
           </div>
          </div>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  sockets: {
    connect() {
      console.log('Student.vue: socket connected');
    }
  },
  data() {
    return {
      ready: false,
      isAnswered:false,
      isCorrect:null,
      answers:[{text: "", correct: true}],
      studentName: null,
      statusText: "Waiting for a question...",
      leaderboardScores: [],
      activeQuestion: null,
      answerTime:null,
      gotQuestion:null
    }
  },
  computed: {
    isReady() {
      return this.ready;
    },
    isMultiple(){
      return this.activeQuestion.questionType =="multiple";
    },
  },
  methods: {
    startSession() {
      this.ready = true;
      this.$socket.emit('student-registered', {studentName: this.studentName});
      this.sockets.subscribe('teacher-new-question', (data) => {
        this.activeQuestion = data.question;
        this.answerTime = this.activeQuestion.questionTime;
        this.gotQuestion = true;
      });
    },
    changed(){
      if(this.answers.length >1){
      this.isAnswered =true;
      }else{
        this.isAnswered =false;
      }
    },
    sendAnswerToTeacher() {
         this.isCorrect = this.answers.every(function(element){
          return element.correct == true;
        });
        
        if(this.isCorrect){
          let item = {name: this.studentName, score: parseInt(this.activeQuestion.questionScore)};
          this.leaderboardScores.push(item);
        }else{
          let item = {name: this.studentName, score: 0};
          this.leaderboardScores.push(item);
        }
        console.log(this.isCorrect);
        this.$socket.emit('student-new-answer', {
          studentName: this.studentName, // Question and answers to question
          leaderboardScores: this.leaderboardScores, // Time to answer question
        });
        this.gotQuestion=null;
    },
  },
  destroyed() {
    this.sockets.unsubscribe('teacher-new-question');
  },
  watch: {
  answerTime: {
    handler(value) {
      if (value > 0) {
        setTimeout(() => {
            this.answerTime--;
        }, 1000);
      }
    },
      //immediate: true 
      // This ensures the watcher is triggered upon creation
  }
  },
}
</script>

<style scoped>
.question,
.dialog {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
}

.question .content,
.dialog .content {
  padding: 30px;
  width: 70%;
  max-width: 700px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  text-align: center;
  box-shadow: -10px 10px 20px -10px rgba(0, 0, 0, 0.2);
  background: white;
}
.dialog .content h3, .dialog .content p{
  display: inline;
}

.dialog h4 {
  margin-top: 0;
  margin-bottom: 10px;
}

.dialog input {
  margin: 10px 0;
}
.incorrect{
  color: red;
}
.timer{
  border: 1px solid black;
}

</style>