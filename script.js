function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.style.display="none"
})

document.getElementById(page).style.display="block"

}

function borrowItem(){

let name = document.getElementById("borrower").value
let item = document.getElementById("item").value

alert(name + " ยืม " + item)

}
