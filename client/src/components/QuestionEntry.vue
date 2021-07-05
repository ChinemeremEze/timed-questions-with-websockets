<!--StAuth10065: I Ezeakudolu Chinemeren David, 000778050 certify that this material is my original work. 
No other person's work has been used without due acknowledgement. 
I have not made my work available to anyone else.-->
<template>
    <div>
        <div v-show="type == 'multiple'">
            <h4>Multiple Choice</h4>
            <textarea placeholder="What is your question?" v-model="questionAsked"></textarea>
            <h5>Answers</h5>
            <div class="row" v-for="(answer, idx) in answersAllowed" :key="idx">
                <div class="col-1">
                    <input type="checkbox" v-model="answer.correct" @change="changed">
                </div>
                <div class="col-10">
                    <input type="text" placeholder="Answer" v-model="answer.text" @change="changed">
                </div>
                <div class="col-1">
                    <button @click.prevent="removeAnswer(idx)">Remove</button>
                </div>
            </div>
            <div class="row">
                <div class="col-12 text-right">
                    <button @click.prevent="addAnswer">Add</button>
                </div>
            </div>
        </div>
        <div v-show="type == 'matching'">
            <h4>Matching Pairs</h4>
        </div>
    </div>
</template>

<script>
export default {
    name: "QuestionEntry",
    props: ['type'],
    methods: {
        addAnswer() {
            this.answersAllowed.push({text: "", correct: false});
        },
        removeAnswer(idx) {
            this.answersAllowed.splice(idx, 1);
        },
        changed() {
            this.$emit('input', this.entry);
        }
    },
    computed: {
        entry() {
            let entryContent = {
                question: this.questionAsked,
                answers: this.answersAllowed
            };
            return entryContent;
        },
        hasCorrectAnswer() {
            if(this.answersAllowed.length == 0) return;

            for(let x = 0; x < this.answersAllowed.length; x++) {
                if(this.answersAllowed[x].correct) return true;
            }

            return false;
        },
        ready() {
            return this.hasCorrectAnswer && this.questionAsked;
        }
    },
    data() {
        return {
            questionAsked: null,
            answersAllowed: [
                {text: "", correct: false}
            ],

        }
    }
}
</script>