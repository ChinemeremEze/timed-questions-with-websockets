<template>
    <div>
        <input type="number" readonly v-model="selectedValue" @focus="focused" v-bind:min="min" v-bind:max="max" v-bind:placeholder="placeholder">
        <div v-show="fieldFocused">
            <input type="range" @change="changed" v-bind:min="min" v-bind:max="max" v-bind:step="step">
        </div>
    </div>
</template>

<script>
export default {
    name: "TimeInput",
    props: ['min', 'max', 'placeholder', 'step'],
    methods: {
        changed(evt) {
            this.selectedValue = evt.target.value;
            this.fieldFocused = false;
            this.$emit('input', this.selectedValue);
        },
        focused() {
            this.fieldFocused = true;
        }
    },
    data() {
        return {
            fieldFocused: false,
            selectedValue: 0,
        }
    }
}
</script>