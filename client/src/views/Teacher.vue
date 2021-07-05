<!--StAuth10065: I Ezeakudolu Chinemeren David, 000778050 certify that this material is my original work. 
No other person's work has been used without due acknowledgement. 
I have not made my work available to anyone else.-->
<template>
  <div class="teacher">
    <h1>Teacher</h1>
    <p>Post a question to students</p>

    <div class="row">
      <div class="col-6">
        <select v-model="questionType">
          <option value="">Select a question type</option>
          <option value="multiple">Multiple Choice</option>
          <option value="matching">Matching Pairs</option>
        </select>
      </div>
      <div class="col-4">
        <input type="number" min="0" placeholder="Score" v-model="questionScore">
      </div>
      <div class="col-2">
        <TimeInput min="10" max="90" step="5" placeholder="Time" id="timeInput" v-model="questionTime" @input="questionTime = $event" />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <QuestionEntry v-bind:type="questionType" id="questionEntry" @input="questionContent = $event" />
      </div>
    </div>

    <div class="row" v-if="isQuestionReady">
      <div class="col-12">
        <button @click.prevent="poseQuestionToStudents">Post</button>
      </div>
    </div>

    <div class="dialog" v-if="questionPosted">
      <div class="content">
        <nav>
            <p>Total answers</p>
            <p id="totalAnswers">{{answers.length}}</p>
        </nav>
        <nav>
            <p>Total correct</p>
            <p id="totalCorrect">{{totalCorrect}}</p>
        </nav>
        <nav>
            <p>% correct</p>
            <p id="totalCorrect">{{totalCorrectPercent}}</p>
        </nav>
        <nav>
            <p>Time remaining</p>
              <p>{{questionTime}} </p>
        </nav>
        <div id="showBoard" v-if="answers.length>0">
          <h3>Correct</h3>
         <div v-for="ans in answers" :key="ans.studentName">
            <div class="row" v-if="ans.leaderboardScores[0].score >0">
              <div class="col-10">{{ ans.studentName }}</div>
              <div class="col-2">{{ ans.leaderboardScores[0].score }}</div>
            </div>
            </div>
              <hr>
              <h3>Incorrect</h3>
          <div v-for="ans in answers" :key="ans.studentName">
            <div class="row" v-if="ans.leaderboardScores[0].score == 0">
              <div class="col-10">{{ans.studentName }}</div>
              <div class="col-2">{{ans.leaderboardScores[0].score }}</div>
            </div>
          </div>
        </div>
        <button v-if="questionTime == 0" @click.prevent="postNewQuestion"> Post Another Question</button>
        
      </div>
    </div>

   <!-- <div class="dialog"  v-else-if="answers.length >0">
      <div class="content">
        <nav>
          <div>
            <h2>Answer recieved</h2>
          </div>
        </nav>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import TimeInput from '../components/TimeInput';
import QuestionEntry from '../components/QuestionEntry';

export default {
  components: {
    TimeInput,
    QuestionEntry,
  },
  sockets: {
    connect() {
      console.log('Teacher.vue: socket connected');

      this.sockets.subscribe('student-registered', (data) => {
        this.students.push(data);
      });
    }
  },
  methods: {
    poseQuestionToStudents() {
      this.$socket.emit('teacher-new-question', {
        questionContent: this.questionContent, // Question and answers to question
        questionTime: this.questionTime, // Time to answer question
        questionScore: this.questionScore, // Score for getting question correct
        questionType: this.questionType, // Type of question (multiple, matching)
      });
      this.questionPosted = true;
      this.sockets.subscribe('student-new-answer', (data) => {
        this.answers.push(data.answer);
        //console.log(this.answers[0].studentName);
      });
   
      
     this.countDownTimer();
 
    },
    postNewQuestion(){
      var timeInput = document.getElementById('timeInput');
      var questionEntry = document.getElementById('questionEntry');
      this.questionContent = "";
      this.questionPosted = false;
      this.questionType = "";
      this.questionTime = 0;
      this.questionScore = 0;
      questionEntry.html = "";
      timeInput.html = "";
    },
    countDownTimer() {
      if(this.questionTime > 0) {
        setTimeout(() => {
          this.questionTime -= 1
          this.countDownTimer()
        }, 1000)
        return this.questionTime;
      }
      return this.questionTime;
    }
  },
  computed: {
    isQuestionReady() {
      return this.questionScore > 0 && this.questionTime > 0 && this.questionType != "";
    },
   totalCorrect(){
     let total = 0;
     if(this.answers.length > 0){
      for(let i=0; i<this.answers.length; i++){
        if(this.answers[i].leaderboardScores[0].score > 0){
          total = total + 1;
          console.log(this.answers[i].leaderboardScores[0].score);
        } 
      }
      return total;
     }
     return 0;
    },
    totalCorrectPercent(){
      if(this.answers.length>0){
        return Math.round((this.totalCorrect/this.answers.length)*100);
      }
      return 0;
    }
  },
  data() {
    return {
      questionPosted: false,
      questionType: "",
      questionTime: 0,
      questionScore: 0,
      questionContent: null,
      students: [],
      answers:[],
    }
  },
  mounted() {
  }
}
</script>
<style scoped>
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

.dialog .content {
  padding: 30px;
  width: 70%;
  max-width: 600px;
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  box-shadow: -10px 10px 20px -10px rgba(0, 0, 0, 0.2);
  background: white;
  text-align: center;
}
.dialog .content nav{
  width: 20%;
  margin: 2%;
  float:left;
  border: solid black 2px;
  border-radius: 10px ;
}
.dialog .content nav p{
  margin: 0%;
}
#showBoard div{
  margin: 0;
  text-align: left;
}

</style>