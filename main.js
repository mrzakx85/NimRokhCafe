const MENU = [
  {
    id: "hot",
    title: "نوشیدنی‌های گرم",
    items: [
      ["اسپرسو", "قوی و کوتاه", 150],
      ["کاپوچینو", "با فوم شیر ابریشمی", 150],
      ["لاته رز", "اسپرسو، شیر بخار داده‌شده، شربت گل رز", 250],
      ["هات چاکلت", "شکلات بلژیکی، خامه", 60],
    ],
  },
  {
    id: "cold",
    title: "نوشیدنی‌های سرد",
    items: [
      ["آیس لاته", "اسپرسو، شیر سرد، یخ", 60],
      ["لیمونادِ توت‌فرنگی", "تازه و کم‌شیرین", 220],
      ["لیمونادِ نعنا", "لیمو، نعنا، آب گازدار", 50],
      ["آیس تی هلو", "چای سیاه، هلو، یخ", 50],
    ],
  },
  {
    id: "breakfast",
    title: "صبحانه",
    items: [
      ["نان تست آووکادو", "نان خمیرترش، تخم‌مرغ، پودر فلفل تند", 110],
      ["پنکیک", "سه پنکیک، توت‌ها، شربت افرا", 100],
      ["املت", "سه تخم‌مرغ، پنیر، سبزی معطر، نان تست", 90],
      ["کاسه گرانولا", "ماست، عسل، میوه تازه", 80],
    ],
  },
  {
    id: "snacks",
    title: "تنقلات",
    items: [
      ["ساندویچ کلاب", "مرغ، بیکن، گوجه، سیب‌زمینی سرخ‌شده", 120],
      ["کروسان", "ساده با کره، یا با پنیر و ژامبون", 250],
      ["بشقاب پنیر", "سه نوع پنیر، آجیل، عسل", 140],
      ["سیب‌زمینی سرخ‌کرده", "با سس سیر", 60],
    ],
  },
  {
    id: "cakes",
    title: "کیک‌ها",
    items: [
      ["کیک توت‌فرنگی", "کیک وانیلی، خامه، توت‌ها", 80],
      ["ناپلئون", "لایه‌های ترد، کرم کاستارد", 70],
      ["ردولوت", "با روکش خامه پنیر", 80],
      ["چیزکیک", "سبک نیویورکی، سس توت", 150],
    ],
  },
  {
    id: "desserts",
    title: "دسرها",
    items: [
      ["تیرامیسو", "قهوه، ماسکارپونه، کاکائو", 750],
      ["پاخلاوا", "سنتی، با گردو", 60],
      ["ماکارون (۳ عدد)", "رز، پسته، وانیل", 70],
      ["بستنی", "سه اسکوپ، به انتخاب شما", 60],
    ],
  },
  {
    id: "fun",
    title: "سرگرمی و فعالیت‌ها",
    note: "از گارسون بخواهید میز شما را آماده کند.",
    items: [
      ["بازی‌های رومیزی", "هر بازی که بخواهید، ۲ ساعت", 50],
      ["گوشه پلی‌استیشن", "ساعتی، تا ۴ نفر", 120],
      ["شب موسیقی زنده", "جمعه، ساعت ۲۰:۰۰. ورودی برای هر نفر", 80],
      ["کارگاه نقاشی", "بوم و رنگ همراه است", 250],
    ],
  },
  {
    id: "hookah",
    title: "قلیان",
    items: [
      ["قلیان کلاسیک", "دو سیب یا انگور", 250],
      ["نعنا یخ", "تازه و سبک", 270],
      ["شب های موسکو", "شیرین و ملایم", 280],
      ["دو سیب", "آلبالو ، نعنا و هندوانه", 350],
    ],
  },
];

/* ========== 2. STATE ========== */
// cart = { "itemKey": quantity }. Item key is "categoryId-index".
let cart = {};
const itemsByKey = {}; // quick lookup: key -> { name, price }

/* ========== 3. HELPERS ========== */
const $ = (id) => document.getElementById(id);
const money = (n) => n + " T ";

/* ========== 4. RENDER THE MENU ========== */
function renderMenu() {
  const nav = $("catNav"),
    menu = $("menu");
  MENU.forEach((cat) => {
    // Navigation chip
    const a = document.createElement("a");
    a.href = "#" + cat.id;
    a.textContent = cat.title;
    nav.appendChild(a);

    // Section
    const sec = document.createElement("section");
    sec.className = "cat";
    sec.id = cat.id;
    sec.innerHTML =
      `<h2>${cat.title.replace("&", "&amp;")}</h2>` +
      (cat.note ? `<p class="note">${cat.note}</p>` : "");
    const grid = document.createElement("div");
    grid.className = "items";

    cat.items.forEach(([name, desc, price], i) => {
      const key = cat.id + "-" + i;
      itemsByKey[key] = { name, price };
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "item";
      btn.dataset.key = key;
      btn.setAttribute("aria-label", `Add ${name}, ${money(price)}`);
      btn.innerHTML = `<span class="qty"></span>
        <span><span class="name">${name}</span><span class="desc">${desc}</span></span>
        <span class="price">${money(price)}</span>`;
      btn.addEventListener("click", () => changeQty(key, +1)); // click = add one
      grid.appendChild(btn);
    });
    sec.appendChild(grid);
    menu.appendChild(sec);
  });
}

/* ========== 5. CART LOGIC ========== */
function changeQty(key, delta) {
  cart[key] = (cart[key] || 0) + delta;
  if (cart[key] <= 0) delete cart[key];
  update();
}

function clearCart() {
  cart = {};
  update();
  $("cartModal").close();
}

// Update every part of the UI that depends on the cart
function update() {
  let total = 0,
    count = 0;
  Object.entries(cart).forEach(([key, q]) => {
    total += itemsByKey[key].price * q;
    count += q;
  });

  // Badges on menu items
  document.querySelectorAll(".item").forEach((el) => {
    const q = cart[el.dataset.key] || 0;
    el.classList.toggle("selected", q > 0);
    el.querySelector(".qty").textContent = q;
  });

  // Bottom bar
  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);
  $("cartBar").classList.toggle("show", count > 0);

  // Modal content
  $("modalTotal").textContent = money(total);
  const list = $("modalList");
  list.innerHTML = "";
  if (count === 0) {
    list.innerHTML = '<li class="empty">Nothing selected yet.</li>';
  }
  Object.entries(cart).forEach(([key, q]) => {
    const { name, price } = itemsByKey[key];
    const li = document.createElement("li");
    li.innerHTML = `<span class="info">${name}</span>
      <span class="stepper">
        <button type="button" aria-label="Remove one ${name}">−</button>
        <span>${q}</span>
        <button type="button" aria-label="Add one ${name}">+</button>
      </span>
      <span class="line-price">${money(price * q)}</span>`;
    const [minus, plus] = li.querySelectorAll("button");
    minus.addEventListener("click", () => changeQty(key, -1));
    plus.addEventListener("click", () => changeQty(key, +1));
    list.appendChild(li);
  });
  // If the modal is open and the cart is now empty, close it
  if (count === 0 && $("cartModal").open) $("cartModal").close();
}

/* ========== 6. EVENTS ========== */
$("cartBar").addEventListener("click", () => $("cartModal").showModal());
$("closeModal").addEventListener("click", () => $("cartModal").close());
$("clearBtn").addEventListener("click", clearCart);
// Click on the dark area outside the modal closes it
$("cartModal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) e.currentTarget.close();
});

/* ========== 7. START ========== */
renderMenu();
update();
