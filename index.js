const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const inputFile = document.querySelector('input[type="file"]')
const image = document.getElementById('image')
const inputs = document.querySelectorAll('input[type="range"]')
const options = {
  grayscale: Grayscale,
  blur: Blur,
  invert: Invert,
}
let filter = undefined

// <== Getting Input's Value and Reading ==>
inputFile.addEventListener('change', handleImageUpload)
function handleImageUpload({ target: { files } }) {
  const file = files[0]
  const reader = new FileReader()
  reader.addEventListener('load', ({ target: { result: url } }) => {
    image.src = url
  })
  reader.readAsDataURL(file)
}
// <== Filter ==>
inputs.forEach((range) => {
  range.addEventListener('change', (e) => {
    let key = range.getAttribute('name')
    if (options[key]) {
      filter = key
    }
  })
})
// <== Drawing image  ==>
image.addEventListener('load', () => {
  canvas.width = image.width > 370 ? 360 : image.width
  canvas.height = image.height > 420 ? 420 : image.width
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
})
// <== Drag and Drop  ==>
canvas.draggable = true
canvas.addEventListener('dragover', (e) => e.preventDefault())
canvas.addEventListener('dragenter', (e) => {
  e.preventDefault()
  canvas.style.borderColor = '#929225'
})
canvas.addEventListener('dragleave', (e) => {
  canvas.style.borderColor = '#570b0b'
})
canvas.addEventListener('drop', (e) => {
  e.preventDefault()
  canvas.style.borderColor = '#8d8d40'
  const {
    dataTransfer: { files },
  } = e
  const file = files[0]
  const reader = new FileReader()

  reader.addEventListener('load', ({ target: { result: url } }) => {
    image.src = url
  })
  reader.readAsDataURL(file)
})
// <== filters  ==>
function applyFilter(data) {}
function Grayscale() {}
function Blur() {}
function Invert() {}
