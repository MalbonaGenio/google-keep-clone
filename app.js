class App {
  constructor() {
    //the this.$form is to indicate that we are refering to an html element for data we will use this.data

    //data elements
    this.notes = []
    //HTML elements
    this.$form = document.querySelector('#form')
    this.$noteTitle = document.querySelector('#note-title')
    this.$noteText = document.querySelector('#note-text')
    this.$formButtons = document.querySelector('#form-buttons')

    this.addEventListeners() //want to make sure we run the method when we create the app
  }

  //define the eventListenrs for the app
  addEventListeners() {
    document.body.addEventListener('click', event => {
      this.handleFormClick(event)
    })

    //event listener for the submit of the form, includes the button and enter key
    this.$form.addEventListener('submit', event => {
      event.preventDefault() //prevents default reload of the page
      const title = this.$noteTitle.value
      const text = this.$noteText.value
      const hasNote = title || text
      if (hasNote) {
        //instead of passing to arguments we pass a single object so if we dont remember the exact order we will still be able to get the data correctly. This shorthand is equal to write title: title.
        this.addNote({ title, text }) //
      }
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

  addNote(note) {
    const newNote = {
      title: note.title,
      text: note.text,
      color: 'white',
      //sets the id of the note based on the amount of notes in the notes array
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    }

    this.notes = [...this.notes, newNote] //spreads the array notes and adds the newNote at the end
  }
}

new App()