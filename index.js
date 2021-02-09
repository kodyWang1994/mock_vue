window.onload = function () {
  var Demo = new Vue({
    el: 'app',
    data: {
      text: 'HelloWorld',
      inputText: 'I can change'
    },
    methods: {
      changeText () {
        console.log(this.text)
        this.text = Math.random() * 100
      }
    }
  })
}
