class App {
  constructor() {
    //the this.$form is to indicate that we are refering to an html element for data we will use this.data

    //data elements
    this.notes = []
    //HTML elements
    this.$form = document.querySelector("#form")
    this.$noteTitle = document.querySelector("#note-title")
    this.$noteText = document.querySelector("#note-text")
    this.$formButtons = document.querySelector("#form-buttons")
    this.$formCloseButton = document.querySelector("#form-close-button")
    this.$placeHolder = document.querySelector("#placeholder")
    this.$notes = document.querySelector("#notes")

    this.addEventListeners() //want to make sure we run the method when we create the app
  }

  //define the eventListenrs for the app
  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      this.handleFormClick(event)
    })

    //event listener for the submit of the form, includes the button and enter key
    this.$form.addEventListener("submit", (event) => {
      event.preventDefault() //prevents default reload of the page
      const title = this.$noteTitle.value
      const text = this.$noteText.value
      const hasNote = title || text
      if (hasNote) {
        //instead of passing to arguments we pass a single object so if we dont remember the exact order we will still be able to get the data correctly. This shorthand is equal to write title: title.
        this.addNote({ title, text }) //
      }
    })

    this.$formCloseButton.addEventListener("click", (event) => {
      event.stopPropagation() //this avoid the click on the close to also act as a click on the form and thus opening the form.
      this.closeForm()
    })
  }

  handleFormClick(event) {
    //checks if the form elemtn is the target of the click
    const isFormClicked = this.$form.contains(event.target)
    const title = this.$noteTitle.value
    const text = this.$noteText.value
    const hasNote = title || text
    if (isFormClicked) {
      this.openForm()
    } else if (hasNote) {
      //if there is some content in the note when cliking away will create a note. Whitout having to use the submit.
      this.addNote({ title, text })
    } else this.closeForm()
    // isFormClicked ? this.openForm() : this.closeForm()
  }

  openForm() {
    this.$form.classList.add("form-open")
    this.$noteTitle.style.display = "block"
    this.$formButtons.style.display = "block"
  }

  closeForm() {
    this.$form.classList.remove("form-open")
    this.$noteTitle.style.display = "none"
    this.$formButtons.style.display = "none"
    this.$noteTitle.value = ""
    this.$noteText.value = ""
  }

  addNote({ title, text }) {
    const newNote = {
      title,
      text,
      color: "white",
      //sets the id of the note based on the amount of notes in the notes array
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
    }

    this.notes = [...this.notes, newNote] //spreads the array notes and adds the newNote at the end, this way we update the array without mutating the original, we will preserve all the old notes stored there.
    this.displayNotes()
    this.closeForm()
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0
    this.$placeHolder.style.display = hasNotes ? "none" : "flex"
    //using .map iterates trough the notes array and returns all the following html to the new notes to display.
    //Setting the innerhtml to the .map will populate the div notes with all the generated code with each note data.
    this.$notes.innerHTML = this.notes
      .map(
        (note) => `
        <div style="background: ${note.color};" class="note">
          <div class="${note.title && "note-title"}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" src="https://icon.now.sh/palette">
              <img class="toolbar-delete" src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
     `
      )
      .join("") //Transforms the array into a string and bc no separator is defined the , between notes is not displayed anymore.
  }
}

new App()
