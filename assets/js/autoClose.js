document.addEventListener('click', function (e) {
  document.querySelectorAll('details[open]').forEach(detail => {
    if (!detail.contains(e.target)) {
      detail.removeAttribute('open')
    }
  })
})

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', function () {
    this.closest('details').removeAttribute('open')
  })
})
