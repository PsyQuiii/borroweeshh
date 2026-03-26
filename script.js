let users = JSON.parse(localStorage.getItem("users")) || []
let currentUser = localStorage.getItem("currentUser") || null

let borrowData = JSON.parse(localStorage.getItem("borrowData")) || {}
let historyData = JSON.parse(localStorage.getItem("historyData")) || []

// ================== PAGE ==================
function showPage(page) {

    // 🔥 กันเข้าหน้าอื่นถ้ายังไม่ login
    if (page !== "login" && page !== "register" && !currentUser) {
        page = "login"
    }

    document.querySelectorAll(".page").forEach(p => {
        p.style.display = "none"
    })

    document.getElementById(page).style.display = "block"

    if (page === "return") {
        loadBorrowedItems()
    }

    if (page === "equipment") {
        renderEquipment()
    }

    if (page === "history") {
        renderHistory()
    }

    if (page === "dashboard") {
        updateDashboard()
    }

    if (page === "borrow") {
        const item = document.getElementById("item");
        if (item) {
            item.dispatchEvent(new Event("change"));
        }
    }
}

// ================== LOGIN ==================
function login() {

    let username = document.getElementById("loginUsername").value
    let password = document.getElementById("loginPassword").value

    let user = users.find(u => u.username === username && u.password === password)

    if (!user) {
        alert("Username หรือ Password ไม่ถูกต้อง")
        return
    }

    currentUser = username
    localStorage.setItem("currentUser", currentUser)

    showPage("dashboard")
}

function logout() {
    localStorage.removeItem("currentUser")
    currentUser = null
    showPage("login")
}

// ================== REGISTER ==================
function register() {

    let username = document.getElementById("regUsername").value
    let department = document.getElementById("regDepartment").value
    let password = document.getElementById("regPassword").value
    let confirm = document.getElementById("regConfirmPassword").value

    if (!username || !department || !password || !confirm) {
        alert("กรุณากรอกข้อมูลให้ครบ")
        return
    }

    if (password !== confirm) {
        alert("รหัสผ่านไม่ตรงกัน")
        return
    }

    let exist = users.find(u => u.username === username)
    if (exist) {
        alert("มี username นี้แล้ว")
        return
    }

    users.push({ username, department, password })
    localStorage.setItem("users", JSON.stringify(users))

    alert("สมัครสมาชิกสำเร็จ")
    showPage("login")
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
    let name = currentUser
    let dateInput = document.getElementById("borrowDate").value
    let returnDate = document.getElementById("returnDate").value
    if (!name || !dateInput) {
        alert("กรุณากรอกข้อมูลให้ครบ")
        return
    }

    // ✅ เช็คก่อน
    let alreadyBorrow = Object.values(borrowData).find(b => b.name === currentUser)
    if (alreadyBorrow) {
        alert("คุณมีอุปกรณ์ที่ยืมอยู่แล้ว")
        return
    }

    if (equipmentData[code].status === "borrow") {
        showErrorPopup()
        return
    }

    // ✅ ค่อยบันทึก
    equipmentData[code].status = "borrow"

    borrowData[code] = {
        name: name,
        date: dateInput,
        returnDate: returnDate
    }


    historyData.push({
        borrower: name,
        itemName: equipmentData[code].name,
        code: code,
        status: "ยืม",
        date: dateInput
    })

    localStorage.setItem("borrowData", JSON.stringify(borrowData))
    localStorage.setItem("historyData", JSON.stringify(historyData))

    showSuccessPopup("ยืมอุปกรณ์สำเร็จ")
    updateDashboard()
    renderEquipment()
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

    // ✅ ดึงชื่อคนยืมเดิม
    let borrowerName = borrowData[code]?.name || "-"

    // ✅ บันทึก history (คืน)
    historyData.push({
        borrower: borrowerName,
        itemName: equipmentData[code].name,
        code: code,
        status: "คืน",
        date: endDate
    })

    // ลบข้อมูลการยืม
    delete borrowData[code]

    showSuccessPopup("คืนอุปกรณ์เรียบร้อยแล้ว")

    updateDashboard()      // ✅ เพิ่ม
    renderEquipment()      // ✅ เพิ่ม

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
const itemSelect = document.getElementById("item");

if (itemSelect) {
    itemSelect.addEventListener("change", function () {

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
    });
}

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
        let returnDate = "-";

        if (borrow) {
            status = "borrow";
            borrower = borrow.name;
            date = borrow.date;
            returnDate = borrow.returnDate || "-";
        }


        const statusText = status === "free" ? "ว่าง" : "ถูกยืม";
        const statusClass = status === "free" ? "status-free" : "status-borrow";

        tbody.innerHTML += `
    <tr>
        <td><img src="${item.img}" class="item-img"></td>
        <td>${item.name}</td>
        <td>${code}</td>
        <td>${code}</td> <!-- 🔥 เลขครุภัณฑ์ -->
        <td class="${statusClass}">${statusText}</td>
        <td>${borrower}</td> <!-- 🔥 หน่วยงาน -->
        <td>${date}</td> <!-- 🔥 วันที่ยืม -->
        <td>-</td> <!-- 🔥 วันที่คืน (ยังไม่มี) -->
    </tr>
`;

    });
}

// ================== HISTORY ==================

function renderHistory() {

    const tbody = document.getElementById("historyTable")
    tbody.innerHTML = ""

    historyData.forEach(item => {

        const statusClass = item.status === "ยืม" ? "status-borrow" : "status-free"

        tbody.innerHTML += `
            <tr>
                <td>${item.borrower}</td>
                <td>${item.itemName}</td>
                <td>${item.code}</td>
                <td class="${statusClass}">${item.status}</td>
                <td>${item.date}</td>
            </tr>
        `
    })
}

function updateDashboard() {

    let total = Object.keys(equipmentData).length
    let borrow = 0
    let free = 0

    Object.values(equipmentData).forEach(item => {
        if (item.status === "borrow") {
            borrow++
        } else {
            free++
        }
    })

    document.getElementById("totalCount").innerText = total
    document.getElementById("borrowCount").innerText = borrow
    document.getElementById("freeCount").innerText = free
}

document.addEventListener("DOMContentLoaded", function () {

    const itemSelect = document.getElementById("item");

    if (itemSelect) {
        itemSelect.addEventListener("change", function () {

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
        });
    }

})

showPage("login");
