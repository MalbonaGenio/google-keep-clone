class App {
  constructor() {
    //the this.$form is to indicate that we are refering to an html element for data we will use this.data

    //data elements
    this.notes = []
    this.title = ""
    this.text = ""
    this.id = ""
    //HTML elements
    this.$form = document.querySelector("#form")
    this.$noteTitle = document.querySelector("#note-title")
    this.$noteText = document.querySelector("#note-text")
    this.$formButtons = document.querySelector("#form-buttons")
    this.$formCloseButton = document.querySelector("#form-close-button")
    this.$placeHolder = document.querySelector("#placeholder")
    this.$notes = document.querySelector("#notes")
    this.$modal = document.querySelector(".modal")
    this.$modalTitle = document.querySelector(".modal-title")
    this.$modalText = document.querySelector(".modal-text")
    this.$modalCloseButton = document.querySelector(".modal-close-button")
    this.$colorTooltip = document.querySelector("#color-tooltip")

    this.addEventListeners() //want to make sure we run the method when we create the app
  }

  //define the eventListenrs for the app
  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      this.handleFormClick(event)
      //selectNote needs to run before openModal. To set the values in the constructor before the modal opens, otherwise the fields will not be populated with the note info.
      this.selectNote(event)
      this.openModal(event)
      this.deleteNote(event)
    })

    document.body.addEventListener("mouseover", (event) => {
      this.openTooltip(event)
    })

    document.body.addEventListener("mouseout", (event) => {
      this.closeTooltip(event)
    })

    //Use Function instead of and arrow function bc we need to reference the $colorTooltip element inside the function. With an arrow funstion we would jumpt one level above the scope.
    this.$colorTooltip.addEventListener("mouseover", function () {
      //will keep the colorTooltip open
      this.style.display = "flex"
    })

    this.$colorTooltip.addEventListener("mouseout", function () {
      this.style.display = "none"
    })

    this.$colorTooltip.addEventListener("click", (event) => {
      const color = event.target.dataset.color
      if (color) {
        this.editNoteColor(color)
      }
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

    this.$modalCloseButton.addEventListener("click", (event) => {
      this.closeModal()
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

  openModal(event) {
    //prevents opening the modal when we click the  trash button
    if (event.target.matches(".toolbar-delete")) return

    if (event.target.closest(".note")) {
      this.$modal.classList.toggle("open-modal")
      this.$modalTitle.value = this.title
      this.$modalText.value = this.text
    }
  }

  closeModal(event) {
    this.editNote()
    this.$modal.classList.toggle("open-modal")
  }

  openTooltip(event) {
    //if not hovering over the rigth element return
    if (!event.target.matches(".toolbar-color")) return
    this.id = event.target.dataset.id
    const noteCoordinates = event.target.getBoundingClientRect()
    const horizontal = noteCoordinates.left + window.scrollX
    const vertical = noteCoordinates.top + window.scrollY
    this.$colorTooltip.style.transform = `translate(${horizontal}px ,${vertical}px)`
    this.$colorTooltip.style.display = "flex"
  }

  closeTooltip(event) {
    //if not hovering over the rigth element return
    if (!event.target.matches(".toolbar-color")) return
    this.$colorTooltip.style.display = "none"
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

  editNote() {
    //take the values for title and text from the html modal input
    const title = this.$modalTitle.value
    const text = this.$modalText.value
    // map trough the notes array, when the id of both elements match we spread the object and put the title and text so we update the fields with the new values.
    //use Number bc the this.id on the html is a string while the one on the object array is a number.
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, title, text } : note
    )
    this.displayNotes()
  }

  //The color is passed from the event listener click, that gathers the color from the dataset.color
  editNoteColor(color) {
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, color } : note
    )
    this.displayNotes()
  }

  selectNote(event) {
    const $selectedNote = event.target.closest(".note")
    if (!$selectedNote) return //makes sure to not run the rest of the code if the is no note selected.
    //.children will return an array of the selected element. We also know that the two first children are title and text. So using array deconstructing we can assign the values directly.
    const [$noteTitle, $noteText] = $selectedNote.children
    //assing the values to the ones defined in the constructor so we can use them in anyother method too.
    this.title = $noteTitle.innerText
    this.text = $noteText.innerText
    //what comes after the data- in the html will be a property of dataset in this case id
    this.id = $selectedNote.dataset.id
  }

  deleteNote(event) {
    //prevents bubbling with the open modal
    event.stopPropagation()
    if (!event.target.matches(".toolbar-delete")) return
    const id = event.target.dataset.id
    this.notes = this.notes.filter((note) => note.id !== Number(id))
    this.displayNotes()
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0
    this.$placeHolder.style.display = hasNotes ? "none" : "flex"
    //using .map iterates trough the notes array and returns all the following html to the new notes to display.
    //Setting the innerhtml to the .map will populate the div notes with all the generated code with each note data.
    //The data-id allows us to store data in the html markup, can we used to retrive info about the note for the selectNote method.
    this.$notes.innerHTML = this.notes
      .map(
        (note) => `
        <div style="background: ${note.color};" class="note" data-id="${note.id}">
          <div class="${note.title && "note-title"}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" data-id="${
                note.id
              }" src="https://icon.now.sh/palette">
              <img class="toolbar-delete" data-id="${
                note.id
              }" src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
     `
      )
      .join("") //Transforms the array into a string and bc no separator is defined the , between notes is not displayed anymore.
  }
}

new App()
