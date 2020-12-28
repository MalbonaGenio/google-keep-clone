class App {
  constructor() {
    //the this.$form is to indicate that we are refering to an html element for data we will use this.data
    this.$form = document.querySelector('#form')
    this.$noteTitle = document.querySelector('#note-title')
    this.$formButtons = document.querySelector('#form-buttons')

    this.addEventListeners() //want to make sure we run the method when we create the app
  }

  //define the eventListenrs for the app
  addEventListeners() {
    document.body.addEventListener('click', event => {
      this.handleFormClick(event)
    })
  }

  handleFormClick(event) {
    //checks if the form elemtn is the target of the click
    const isFormClicked = this.$form.contains(event.target)
    isFormClicked ? this.openForm() : this.closeForm()
  }

  openForm() {
    this.$form.classList.add('form-open')
    this.$noteTitle.style.diplay = 'block'
    this.$formButtons.style.display = 'block'
  }

  closeForm() {
    this.$form.classList.remove('form-open')
    this.$noteTitle.style.display = 'none'
    this.$formButtons.style.display = 'none'
  }
}

new App()