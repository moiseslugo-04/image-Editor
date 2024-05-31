const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const inputFile = document.querySelector('input[type="file"]')
const image = document.getElementById('image')
const inputs = document.querySelectorAll('input[type="range"]')
const btnDownload = document.getElementById('download')
const options = {
  grayscale: applyGrayscale,
  blur: applyBlur,
  invert: applyInvert,
}
const currentValues = {
  grayscale: 0,
  blur: 0,
  invert: 0,
}
let currentFilter = undefined
let imageName = undefined
inputFile.addEventListener('change', handleImageUpload)
inputs.forEach((range) =>
  range.addEventListener('input', () => handleRangeInput(range))
)
//drag adn drop events
canvas.addEventListener('dragover', (e) => e.preventDefault())
canvas.addEventListener('dragenter', (e) => handleDragEnter)
canvas.addEventListener('dragleave', (e) => handleDragLeave)
canvas.addEventListener('drop', (e) => handleDrop)
// <== Getting Input's Value and Reading ==>
function handleImageUpload({ target: { files } }) {
  const file = files[0]
  imageName = file.name
  const reader = new FileReader()
  reader.onload = ({ target: { result: url } }) => (image.src = url)
  reader.readAsDataURL(file)
}
// <== Filter Options ==>
function handleRangeInput(range) {
  let key = range.getAttribute('name')
  if (options[key]) {
    currentFilter = { key, value: parseInt(range.value) }
    applyFilters()
  }
}

// <== Drag and Drop  ==>
canvas.draggable = true
function handleDragEnter(e) {
  e.preventDefault()
  canvas.style.borderColor = '#929225'
}
function handleDragLeave(e) {
  canvas.style.borderColor = '#570b0b'
}
function handleDrop(e) {
  e.preventDefault()
  canvas.style.borderColor = '#8d8d40'
  const file = e.dataTransfer.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = ({ target: { result: url } }) => (image.src = url)
  reader.readAsDataURL(file)
}

// <== Drawing image  ==>
image.addEventListener('load', () => {
  canvas.width = Math.min(image.width, 360)
  canvas.height = Math.min(image.height, 420)
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  applyFilters()
})

// <== filters  ==>
function applyFilters() {
  if (image.src) {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    Object.keys(currentValues).forEach((key) => {
      const value = currentValues[key]
      if (value !== 0 && options[key]) {
        imageData = options[key](imageData, value)
      }
    })

    ctx.putImageData(imageData, 0, 0)
  }
}

function applyGrayscale(imageData, value) {
  const { data } = imageData
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11
    data[i] = gray * (value / 100) + data[i] * (1 - value / 100)
    data[i + 1] = gray * (value / 100) + data[i + 1] * (1 - value / 100)
    data[i + 2] = gray * (value / 100) + data[i + 2] * (1 - value / 100)
  }
  return imageData
}

function applyBlur(imageData, value) {
  // Create a temporary canvas to apply the blur filter
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  tempCanvas.width = canvas.width
  tempCanvas.height = canvas.height
  tempCtx.putImageData(imageData, 0, 0)
  tempCtx.filter = `blur(${value}px)`
  tempCtx.drawImage(tempCanvas, 0, 0)
  return tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
}
function applyInvert(imageData, value) {
  const { data } = imageData
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i] * (value / 100)
    data[i + 1] = 255 - data[i + 1] * (value / 100)
    data[i + 2] = 255 - data[i + 2] * (value / 100)
  }
  return imageData
}

// <== download Image ==>
btnDownload.addEventListener('click', () => {
  const link = document.createElement('a')
  console.log(inputFile.target)
  link.href = canvas.toDataURL()
  link.download = `${imageName}-edited.png`
  link.click()
})
