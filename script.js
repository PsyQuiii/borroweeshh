// ================== INITIAL DATA ==================
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = localStorage.getItem("currentUser") || null;
let borrowData = JSON.parse(localStorage.getItem("borrowData")) || {};
let historyData = JSON.parse(localStorage.getItem("historyData")) || [];

const equipmentData = {
    // กลุ่มเครื่องวัดความสว่างของแสง (Lux Meter)
    "T.016397": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000423", img: "img/t.016397.jpg", status: "free" },
    "T.016398": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000424", img: "img/t.016398.jpg", status: "free" },
    "T.016399": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000425", img: "img/t.016399.jpg", status: "free" },
    "T.016427": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000426", img: "img/t.016427.jpg", status: "free" },
    "T.016431": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000427", img: "img/t.016431.jpg", status: "free" },
    "T.016437": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000428", img: "img/t.016437.jpg", status: "free" },
    "T.016454": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000429", img: "img/t.016454.jpg", status: "free" },
    "T.016478": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000430", img: "img/t.016478.jpg", status: "free" },
    "T.016484": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000431", img: "img/t.016484.jpg", status: "free" },
    "T.016488": { name: "เครื่องวัดความสว่างของแสง", asset: "6900000432", img: "img/t.016488.jpg", status: "free" },

    // กลุ่มเครื่องวัดอุณหภูมิและความชื้น (Humidity/Temp Meter)
    "AM.36971": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000446", img: "img/am.36971.jpg", status: "free" },
    "AM.36974": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000509", img: "img/am.36974.jpg", status: "free" },
    "AM.36975": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000510", img: "img/am.36975.jpg", status: "free" },
    "AM.36976": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000511", img: "img/am.36976.jpg", status: "free" },
    "AM.54261": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000512", img: "img/am.54261.jpg", status: "free" },
    "AM.54262": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000513", img: "img/am.54262.jpg", status: "free" },
    "AM.57878": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000514", img: "img/am.57878.jpg", status: "free" },
    "AM.57879": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000515", img: "img/am.57879.jpg", status: "free" },
    "AM.57881": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000516", img: "img/am.57881.jpg", status: "free" },
    "AM.57874": { name: "เครื่องวัดอุณหภูมิและความชื้น", asset: "6900000517", img: "img/am.57874.jpg", status: "free" },

    "49327": {
        name: "เครื่องวัดความเข้มแสงอาทิตย์",
        asset: "6900001073",
        img: "img/49327.jpg",
        status: "free"
    },
    "HV24B0107563": {
        name: "เครื่องบันทึกอ่านข้อมูล",
        asset: "6900001074",
        img: "img/hv24b0107563.jpg",
        status: "free"
    }
};

// ซิงค์สถานะจาก borrowData เข้า equipmentData ตอนโหลดหน้าเว็บ
Object.keys(borrowData).forEach(code => {
    if (equipmentData[code]) equipmentData[code].status = "borrow";
});

// ================== CORE LOGIC (เชื่อมทุกหน้า) ==================

function updateAllStats() {
    let total = Object.keys(equipmentData).length;
    let borrowed = 0;
    let free = 0;

    Object.values(equipmentData).forEach(item => {
        if (item.status === "borrow") borrowed++;
        else free++;
    });

    // อัปเดตหน้า Dashboard
    if (document.getElementById("totalCount")) document.getElementById("totalCount").innerText = total;
    if (document.getElementById("borrowCount")) document.getElementById("borrowCount").innerText = borrowed;
    if (document.getElementById("freeCount")) document.getElementById("freeCount").innerText = free;

    // อัปเดตหน้ารายการอุปกรณ์ (Stats ด้านบน)
    if (document.getElementById("eqTotalItem")) document.getElementById("eqTotalItem").innerText = total;
    if (document.getElementById("eqBorrowItem")) document.getElementById("eqBorrowItem").innerText = borrowed;
    if (document.getElementById("eqFreeItem")) document.getElementById("eqFreeItem").innerText = free;
}

function showPage(page) {
    if (page !== "login" && page !== "register" && !currentUser) page = "login";

    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById(page).style.display = "block";

    if (page === "dashboard") updateAllStats();
    if (page === "equipment") renderEquipment();
    if (page === "return") loadBorrowedItems();
    if (page === "history") renderHistory();
    if (page === "borrow") updatePreview();
    if (page === "borrow") {
        updatePreview();
        updateBorrowOptions(); // สั่งให้ไล่เช็คของว่างทันที
    }

}

// ================== EQUIPMENT & SEARCH ==================

function renderEquipment() {
    let table = document.getElementById("equipmentTable");
    table.innerHTML = "";

    let borrowData = JSON.parse(localStorage.getItem("borrowData")) || {};

    let total = 0;
    let borrowed = 0;

    for (let code in equipmentData) {
        let item = equipmentData[code];
        let borrowInfo = borrowData[code] || {};

        let isBorrowed = borrowInfo.borrower ? true : false;

        total++;
        if (isBorrowed) borrowed++;

        let row = document.createElement("tr");

        row.innerHTML = `
        <td><img src="${item.img}" width="50"></td>
        <td>${item.name}</td>
        <td>${code}</td>

        <td>
            <span class="${isBorrowed ? 'status-borrow' : 'status-free'}">
                ${isBorrowed ? 'ถูกยืม' : 'ว่าง'}
            </span>
        </td>

        <td>${borrowInfo.borrower || "-"}</td>
        <td>${borrowInfo.dept || "-"}</td>
        <td>${borrowInfo.email || "-"}</td>
        <td>${borrowInfo.phone || "-"}</td>
        <td>${borrowInfo.date || "-"}</td>
        <td>${borrowInfo.returnDate || "-"}</td>

        <td>
            ${borrowInfo.fileUrl 
                ? `<a href="${borrowInfo.fileUrl}" target="_blank">📄 ดูไฟล์</a>`
                : "-"
            }
        </td>
        `;

        table.appendChild(row);
    }

    // update stats
    document.getElementById("eqTotalItem").innerText = total;
    document.getElementById("eqBorrowItem").innerText = borrowed;
    document.getElementById("eqFreeItem").innerText = total - borrowed;
}

function searchItem() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let tr = document.querySelectorAll("#equipmentTable tr");
    tr.forEach(row => {
        let name = row.cells[1].innerText.toLowerCase();
        let code = row.cells[2].innerText.toLowerCase();
        row.style.display = (name.includes(input) || code.includes(input)) ? "" : "none";
    });
}

// ================== BORROW & PREVIEW ==================

function updatePreview() {
    const itemSelect = document.getElementById("item");
    if (!itemSelect || itemSelect.value === "") {
        // ล้างค่าถ้ายังไม่ได้เลือก
        document.getElementById("previewImg").src = "";
        document.getElementById("itemName").innerHTML = "<strong>ชื่อ:</strong> -";
        document.getElementById("itemCode").innerHTML = "<strong>รหัส:</strong> -";
        document.getElementById("itemStatus").innerHTML = "สถานะ: -";
        document.getElementById("itemStatus").className = "";
        return;
    }

    const code = itemSelect.value.split(" - ")[1];
    const data = equipmentData[code];

    if (data) {
        document.getElementById("previewImg").src = data.img;
        document.getElementById("itemName").innerHTML = `<strong>ชื่อ:</strong> ${data.name}`;
        document.getElementById("itemCode").innerHTML = `<strong>รหัส:</strong> ${code}`;
        const statusEl = document.getElementById("itemStatus");
        statusEl.innerHTML = `สถานะ: ${data.status === "free" ? "ว่าง" : "ถูกยืม"}`;
        statusEl.className = data.status === "free" ? "status-free" : "status-borrow";
    }
}

function borrowItem() {
    const itemSelect = document.getElementById("item");
    const code = itemSelect.value.split(" - ")[1];

    const startDate = document.getElementById("borrowDate").value;
    const endDate = document.getElementById("returnDate").value;

    if (!startDate || !endDate) {
        alert("กรุณาระบุวันที่");
        return;
    }

    if (equipmentData[code].status === "borrow") {
        alert("อุปกรณ์ถูกยืมแล้ว");
        return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = (end - start) / (1000 * 60 * 60 * 24);

    if (diffDays > 30) {
        alert("❌ ยืมได้ไม่เกิน 1 เดือน");
        return;
    }

    if (diffDays < 0) {
        alert("❌ วันที่คืนต้องมากกว่าวันที่ยืม");
        return;
    }

    const userDetail = users.find(u => u.username === currentUser);
    const departmentName = userDetail ? userDetail.department : currentUser;

    const formData = new FormData();

    // ✅ ข้อมูลหลัก
    formData.append("code", code);
    formData.append("name", equipmentData[code].name);
    formData.append("status", "ยืม");
    formData.append("department", departmentName);
    formData.append("borrowDate", startDate);
    formData.append("returnDate", endDate);

    // ✅ กัน user เก่าไม่มีข้อมูล
    formData.append("email", userDetail?.email || "-");
    formData.append("phone", userDetail?.phone || "-");

    const fileInput = document.getElementById("borrowFile");
    const file = fileInput.files[0];

    // =========================
    // 📁 มีไฟล์
    // =========================
    if (file) {
        const reader = new FileReader();

        reader.onload = function () {
            const base64 = reader.result.split(",")[1];

            formData.append("fileName", file.name);
            formData.append("fileType", file.type);
            formData.append("fileData", base64);

            sendData(formData, code); // ✅ ส่ง code ไปด้วย
        };

        reader.readAsDataURL(file);
    } else {
        // =========================
        // ❌ ไม่มีไฟล์
        // =========================
        sendData(formData, code); // ✅ ต้องมี code
    }

    // =========================
    // 💾 update local
    // =========================
    equipmentData[code].status = "borrow";

    borrowData[code] = {
        borrower: currentUser,
        dept: departmentName,
        email: userDetail?.email || "-",
        phone: userDetail?.phone || "-",
        fileUrl: "", // จะถูกอัปเดตทีหลัง
        date: startDate,
        returnDate: endDate
    };

    historyData.push({
        borrower: departmentName,
        itemName: equipmentData[code].name,
        code: code,
        status: "ยืม",
        date: startDate
    });

    localStorage.setItem("borrowData", JSON.stringify(borrowData));
    localStorage.setItem("historyData", JSON.stringify(historyData));

    showSuccessPopup("ยืมอุปกรณ์สำเร็จ!");
    updateAllStats();

    setTimeout(() => showPage('dashboard'), 1500);
}
function sendData(formData, code = null) {
    fetch("https://script.google.com/macros/s/AKfycbzQKq_yPGVBZoUTn8HbzgEII_e9Lrgosd39qLN4WmVSxwTZ10hbcSOQnlW3S6lGomRy/exec", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(url => {
        console.log("FILE URL:", url);

        // ✅ เอา URL มาใส่ใน borrowData
        if (code && borrowData[code]) {
            borrowData[code].fileUrl = url;
            localStorage.setItem("borrowData", JSON.stringify(borrowData));

            // 🔥 อัปเดตตารางทันที
            if (typeof renderEquipment === "function") {
                renderEquipment();
            }
        }
    })
    .catch(err => console.error("ERROR:", err));
}


// ================== RETURN ==================

function returnItem() {
    const itemSelect = document.getElementById("returnItem");
    const code = itemSelect.value; // ✅ แก้ตรงนี้

    if (!code) {
        alert("กรุณาเลือกอุปกรณ์");
        return;
    }

    if (equipmentData[code].status !== "borrow") {
        alert("❌ อุปกรณ์นี้ไม่ได้ถูกยืม");
        return;
    }

    const userDetail = users.find(u => u.username === currentUser);
    const departmentName = userDetail ? userDetail.department : currentUser;

    const formData = new FormData();

    formData.append("code", code);
    formData.append("name", equipmentData[code].name);
    formData.append("status", "คืน");
    formData.append("department", departmentName);

    sendData(formData);

    equipmentData[code].status = "free"; // 🔥 แก้ด้วย (เดิมคุณใช้ available)

    delete borrowData[code];

    historyData.push({
        borrower: departmentName,
        itemName: equipmentData[code].name,
        code: code,
        status: "คืน",
        date: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem("borrowData", JSON.stringify(borrowData));
    localStorage.setItem("historyData", JSON.stringify(historyData));

    showSuccessPopup("คืนอุปกรณ์สำเร็จ!");
    updateAllStats();

    setTimeout(() => showPage('dashboard'), 1500);
}




function loadBorrowedItems() {
    let select = document.getElementById("returnItem");
    select.innerHTML = "";
    Object.keys(borrowData).forEach(code => {
        let opt = document.createElement("option");
        opt.value = code;
        opt.textContent = `${equipmentData[code].name} - ${code}`;
        select.appendChild(opt);
    });
}

// ================== AUTH & UTILS ==================

function login() {
    let username = document.getElementById("loginUsername").value.trim();
    let password = document.getElementById("loginPassword").value.trim();

    let user = users.find(u => 
        u.username.trim() === username &&
        u.password.trim() === password
    );

    if (!user) {
        console.log("DEBUG USERS:", users);
        return alert("Login ล้มเหลว");
    }

    currentUser = user.username;
    localStorage.setItem("currentUser", currentUser);
    showPage("dashboard");
}


function logout() {
    localStorage.removeItem("currentUser");
    currentUser = null;
    showPage("login");
}

function register() {
    let username = document.getElementById("regUsername").value;
    let email = document.getElementById("regEmail").value;
    let phone = document.getElementById("regPhone").value;
    let dept = document.getElementById("regDepartment").value;
    let pass = document.getElementById("regPassword").value;

    // 🔍 ตรวจสอบข้อมูล
    if (!username || !email || !phone || !dept || !pass) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    // 🔍 ตรวจสอบ email format เบื้องต้น
    if (!email.includes("@")) {
        alert("รูปแบบอีเมลไม่ถูกต้อง");
        return;
    }

    // 🔍 ตรวจสอบเบอร์ (ตัวเลข 10 หลัก)
    if (!/^[0-9]{10}$/.test(phone)) {
        alert("เบอร์โทรต้องเป็นตัวเลข 10 หลัก");
        return;
    }

    // 🔍 เช็ค username ซ้ำ
    if (users.find(u => u.username === username)) {
        alert("มีชื่อนี้แล้ว");
        return;
    }

    // ✅ บันทึกข้อมูล
    users.push({
        username: username,
        email: email,
        phone: phone,
        department: dept,
        password: pass
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("สมัครสำเร็จ");
    showPage("login");
}


function saveAndRefresh() {
    localStorage.setItem("borrowData", JSON.stringify(borrowData));
    localStorage.setItem("historyData", JSON.stringify(historyData));
    updateAllStats();
}

function renderHistory() {
    const tbody = document.getElementById("historyTable");
    tbody.innerHTML = historyData.map(item => `
        <tr>
            <td>${item.borrower}</td>
            <td>${item.itemName}</td>
            <td>${item.code}</td>
            <td class="${item.status === 'ยืม' ? 'status-borrow' : 'status-free'}">${item.status}</td>
            <td>${item.date}</td>
        </tr>`).join("");
}

function showSuccessPopup(m) {
    document.getElementById("popupMessage").innerText = m;
    document.getElementById("successPopup").style.display = "flex";
    setTimeout(() => document.getElementById("successPopup").style.display = "none", 2000);
}

function checkAdminBeforeReturn() {
    const passInput = document.getElementById("adminAuthPass");
    const password = passInput.value;

    // ตรวจสอบรหัสตามที่ตั้งไว้: EESH 1234
    if (password === "1234") {
        passInput.value = ""; // ล้างรหัสออก
        showPage('return');   // ถ้าถูก ให้ไปหน้าคืนอุปกรณ์แบบเดิม
    } else {
        alert("รหัสผ่านไม่ถูกต้อง เฉพาะเจ้าหน้าที่เท่านั้น!");
        passInput.value = "";
    }
}
// ฟังก์ชันเปิด Modal ขยายรูป
function openImageModal(src, title) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("imgExpanded");
    const captionText = document.getElementById("caption");

    modal.style.display = "block";
    modalImg.src = src;
    captionText.innerHTML = title;
}

// ฟังก์ชันปิด Modal
function closeImageModal() {
    document.getElementById("imageModal").style.display = "none";
}
// ฟังก์ชันสำหรับไล่เช็คและซ่อนอุปกรณ์ที่ถูกยืมอยู่
function updateBorrowOptions() {
    const select = document.getElementById("item");
    if (!select) return;

    const options = select.options;

    for (let i = 0; i < options.length; i++) {
        const val = options[i].value;
        if (val === "") continue; // ข้ามตัวเลือก "กรุณาเลือกอุปกรณ์"

        const parts = val.split(" - ");
        if (parts.length < 2) continue;
        const code = parts[1].trim();

        // 🔍 เช็คสถานะจาก equipmentData
        if (equipmentData[code] && equipmentData[code].status !== "free") {
            // 🚫 ถ้าถูกยืม ให้ซ่อนจากรายการ
            options[i].style.display = "none";
            options[i].disabled = true;
        } else {
            // ✅ ถ้าว่าง ให้แสดงตามปกติ
            options[i].style.display = "block";
            options[i].disabled = false;
        }
    }

    // 🚩 บังคับให้หน้าจอกลับไปที่ "กรุณาเลือกอุปกรณ์" ทุกครั้งที่เข้าหน้านี้
    select.value = "";
    updatePreview(); // เรียกเพื่อให้รูปและข้อความหายไปด้วย
}
function clearHistory() {
    // 1. ถามเพื่อความแน่ใจก่อนลบ
    if (confirm("คุณต้องการล้างประวัติการยืมทั้งหมดใช่หรือไม่? (ข้อมูลจะหายถาวร)")) {

        // 2. ล้างข้อมูลในตัวแปร
        historyData = [];

        // 3. อัปเดตลง LocalStorage
        localStorage.setItem("historyData", JSON.stringify(historyData));

        // 4. สั่งวาดตารางใหม่ (จะเป็นตารางว่าง)
        renderHistory();

        // 5. แจ้งเตือนสำเร็จ
        showSuccessPopup("ล้างประวัติเรียบร้อยแล้ว");
    }
}
function clearHistory() {
    const password = prompt("กรุณากรอกรหัสผ่าน Admin เพื่อยืนยันการลบประวัติ:");

    if (password === "1234") { // รหัสเดียวกับหน้าคืนของ
        historyData = [];
        localStorage.setItem("historyData", JSON.stringify(historyData));
        renderHistory();
        showSuccessPopup("ล้างประวัติเรียบร้อยแล้ว");
    } else if (password !== null) {
        alert("รหัสผ่านไม่ถูกต้อง!");
    }
}



// Initialize
document.addEventListener("DOMContentLoaded", () => {
    const itemSelect = document.getElementById("item");
    if (itemSelect) itemSelect.addEventListener("change", updatePreview);

    // 🔥 เพิ่มบรรทัดนี้ลงไป (ถ้ายังไม่มี)
    updateAllStats();

    showPage("login");
});