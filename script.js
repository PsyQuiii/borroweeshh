function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none"
    })

    document.getElementById(page).style.display = "block"

}

function borrowItem() {

    let name = document.getElementById("borrower").value
    let item = document.getElementById("item").value

    alert(name + " ยืม " + item)

}

function searchItem() {

    let input = document.getElementById("searchInput").value.toLowerCase()

    let table = document.querySelector("#equipment table")

    let tr = table.getElementsByTagName("tr")

    for (let i = 1; i < tr.length; i++) {

        let td = tr[i].getElementsByTagName("td")[0]

        if (td) {

            let text = td.textContent.toLowerCase()

            tr[i].style.display = text.includes(input) ? "" : "none"

        }

    }

}
