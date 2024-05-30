const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const inputFile = document.querySelector('input[type="file"]')
const image = document.getElementById('image')
const inputs = document.querySelectorAll('input[type="range"]')
const btnDownload = document.getElementById('download')
const options = {
  grayscale: Grayscale,
  blur: Blur,
  invert: Invert,
}
let filter = undefined
let nameFile = undefined
// <== Getting Input's Value and Reading ==>
inputFile.addEventListener('change', handleImageUpload)
function handleImageUpload({ target: { files } }) {
  const file = files[0]
  nameFile = file.name
  const reader = new FileReader()
  reader.addEventListener('load', ({ target: { result: url } }) => {
    image.src = url
  })
  reader.readAsDataURL(file)
}
// <== Filter Options ==>
inputs.forEach((range) => {
  range.addEventListener('input', () => {
    let key = range.getAttribute('name')
    if (options[key]) {
      filter = [key, range.value]
      applyFilter()
    }
  })
})
// <== Drawing image  ==>
image.addEventListener('load', () => {
  canvas.width = image.width > 370 ? 360 : image.width
  canvas.height = image.height > 420 ? 420 : image.width
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  applyFilter()
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
function applyFilter() {
  if (!filter || image.src.length < 0) return
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const [key, value] = filter
  if (options[key]) {
    options[key](imageData, value)
    ctx.putImageData(imageData, 0, 0)
  }
}
function Grayscale(imageData, value) {
  const { data } = imageData
  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11
    data[i] = gray * (value / 100) + data[i] * (1 - value / 100)
    data[i + 1] = gray * (value / 100) + data[i + 1] * (1 - value / 100)
    data[i + 2] = gray * (value / 100) + data[i + 2] * (1 - value / 100)
  }
  return imageData
}
function Blur(_, value) {
  console.log(value)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.filter = `blur(${value}px)`
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}
function Invert(_, value) {
  console.log(value)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.filter = `invert(${value}%)`
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
}

// <== download Image ==>
btnDownload.addEventListener('click', () => {
  const link = document.createElement('a')
  console.log(inputFile.target)
  link.href = canvas.toDataURL()
  link.download = `${nameFile}-edited.png`
  link.click()
})
