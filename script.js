// ================== PAGE ==================
function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none"
    })

    document.getElementById(page).style.display = "block"

    if (page === "return") {
        loadBorrowedItems()
    }

    if (page === "equipment") {
        renderEquipment();   // ✅ ตัวเดียวพอ
    }
}

// ================== POPUP ==================
function showSuccessPopup(message) {
    const popup = document.getElementById("successPopup")
    const text = document.getElementById("popupMessage")

    text.innerText = message
    popup.style.display = "flex"

    setTimeout(() => {
        popup.style.display = "none"
    }, 2000)
}

function showErrorPopup(message = "อุปกรณ์ถูกยืมอยู่แล้ว") {
    const popup = document.getElementById("errorPopup")
    const text = document.getElementById("errorMessage")

    if (text) text.innerText = message

    popup.style.display = "flex"

    setTimeout(() => {
        popup.style.display = "none"
    }, 2000)
}

let borrowData = {};

// ================== DATABASE ==================
const equipmentData = {

    // 🔵 เครื่องวัดแสง
    "T.016397": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },
    "T.016398": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },
    "T.016399": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },
    "T.016427": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },
    "T.016431": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },
    "T.016437": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },
    "T.016454": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },
    "T.016478": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },
    "T.016484": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },
    "T.016488": { name: "เครื่องวัดความสว่างของแสง", status: "free", img: "เครื่องวัดความสว่างของแสง.jpg" },

    // 🟠 เครื่องวัดอุณหภูมิ
    "AM.36971": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "borrow", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" },
    "AM.36974": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "free", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" },
    "AM.36975": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "free", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" },
    "AM.36976": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "free", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" },
    "AM.54261": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "free", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" },
    "AM.54262": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "free", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" },
    "AM.57878": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "free", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" },
    "AM.57879": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "free", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" },
    "AM.57881": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "free", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" },
    "AM.87874": { name: "เครื่องวัดอุณหภูมิและความชื้น", status: "free", img: "เครื่องวัดอุณหภูมิและความชื้น.jpg" }
}

// ================== BORROW ==================
function borrowItem() {

    let value = document.getElementById("item").value
    let code = value.split(" - ")[1]

    if (equipmentData[code].status === "borrow") {
        showErrorPopup()
        return
    }

    let dateInput = document.getElementById("borrowDate").value

    if (!dateInput) {
        alert("กรุณาเลือกวันที่")
        return
    }

    equipmentData[code].status = "borrow"

    showSuccessPopup("ยืมอุปกรณ์สำเร็จ")
}

// ================== RETURN ==================
function returnItem() {

    let code = document.getElementById("returnItem").value
    let startDate = document.getElementById("returnStartDate").value
    let endDate = document.getElementById("returnEndDate").value

    if (!code || !startDate || !endDate) {
        alert("กรุณากรอกข้อมูลให้ครบ")
        return
    }

    if (new Date(endDate) < new Date(startDate)) {
        alert("วันที่คืนต้องมากกว่าวันที่ยืม")
        return
    }

    equipmentData[code].status = "free"

    showSuccessPopup("คืนอุปกรณ์เรียบร้อยแล้ว")

    // ✅ รีเซ็ตค่า select + วันที่
    document.getElementById("returnItem").value = ""
    document.getElementById("returnStartDate").value = ""
    document.getElementById("returnEndDate").value = ""

    loadBorrowedItems()
}

// ================== SEARCH ==================
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

// ================== PREVIEW ==================
document.getElementById("item").addEventListener("change", function () {

    let value = this.value
    let code = value.split(" - ")[1]

    let data = equipmentData[code]

    let img = document.getElementById("previewImg")
    let nameText = document.getElementById("itemName")
    let codeText = document.getElementById("itemCode")
    let statusText = document.getElementById("itemStatus")

    if (data) {

        img.src = data.img

        nameText.innerHTML = "<strong>ชื่อ:</strong> " + data.name
        codeText.innerHTML = "<strong>รหัส:</strong> " + code

        if (data.status === "free") {
            statusText.innerHTML = "สถานะ: ว่าง"
            statusText.className = "status-free"
        } else {
            statusText.innerHTML = "สถานะ: ถูกยืม"
            statusText.className = "status-borrow"
        }
    }
})

// ================== LOAD RETURN ==================
function loadBorrowedItems() {

    let select = document.getElementById("returnItem")
    select.innerHTML = ""

    Object.keys(equipmentData).forEach(code => {

        if (equipmentData[code].status === "borrow") {

            let option = document.createElement("option")
            option.value = code
            option.textContent = equipmentData[code].name + " - " + code

            select.appendChild(option)
        }
    })

    if (select.innerHTML === "") {
        let option = document.createElement("option")
        option.textContent = "ไม่มีอุปกรณ์ที่ยืมอยู่"
        select.appendChild(option)
    }
}

function renderEquipment() {
    const tbody = document.getElementById("equipmentTable");
    tbody.innerHTML = "";

    // 🔥 เรียงตามรหัส
    const sortedKeys = Object.keys(equipmentData).sort();

    sortedKeys.forEach(code => {
        const item = equipmentData[code];

        // 🔥 ดึงข้อมูลจากระบบยืมคืน (ถ้ามี)
        const borrow = borrowData?.[code] || null;

        let status = item.status;
        let borrower = "-";
        let date = "-";

        if (borrow) {
            status = "borrow";
            borrower = borrow.name;
            date = borrow.date;
        }

        const statusText = status === "free" ? "ว่าง" : "ถูกยืม";
        const statusClass = status === "free" ? "status-free" : "status-borrow";

        tbody.innerHTML += `
            <tr>
                <td><img src="${item.img}" class="item-img"></td>
                <td>${item.name}</td>
                <td>${code}</td>
                <td class="${statusClass}">${statusText}</td>
                <td>${borrower}</td>
                <td>${date}</td>
            </tr>
        `;
    });
}

renderEquipment();
