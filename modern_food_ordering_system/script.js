const foods = [
  {id:1,name:"Margherita Pizza",category:"Pizza",price:299,rating:4.8,tag:"BESTSELLER",desc:"Classic tomato, mozzarella & fresh basil.",img:"https://images.unsplash.com/photo-1574061-2a1d8e6f3b5?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"Smoky BBQ Burger",category:"Burger",price:249,rating:4.7,tag:"CHEF'S PICK",desc:"Juicy patty, smoky BBQ sauce and crisp lettuce.",img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Creamy Alfredo Pasta",category:"Asian",price:279,rating:4.6,tag:"POPULAR",desc:"Creamy parmesan sauce with herbs and pasta.",img:"https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"Fresh Garden Salad",category:"Asian",price:189,rating:4.5,tag:"FRESH",desc:"Crunchy greens, cherry tomatoes and house dressing.",img:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Chocolate Lava Cake",category:"Dessert",price:159,rating:4.9,tag:"SWEET TREAT",desc:"Warm chocolate cake with a gooey center.",img:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Crispy Chicken Burger",category:"Burger",price:229,rating:4.6,tag:"CRISPY",desc:"Golden chicken, creamy mayo and fresh slaw.",img:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Sushi Combo",category:"Asian",price:349,rating:4.8,tag:"NEW",desc:"A tasty mix of fresh rolls and classic flavors.",img:"https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"Mango Smoothie",category:"Drinks",price:129,rating:4.7,tag:"CHILLED",desc:"A refreshing mango blend made to order.",img:"https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=700&q=80"}
];
// Replace malformed demo image URLs with reliable food photography.

foods[6].img="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=700&q=80";
foods[7].img="https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=700&q=80";
foods[2].img="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80";

let cart = [];
let activeCategory = "All";
const foodGrid = document.getElementById("foodGrid");
const searchInput = document.getElementById("searchInput");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");

function renderFoods() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = foods.filter(food =>
    (activeCategory === "All" || food.category === activeCategory) &&
    (food.name.toLowerCase().includes(term) || food.desc.toLowerCase().includes(term))
  );
  foodGrid.innerHTML = filtered.length ? filtered.map(food => `
    <article class="food-card">
      <div class="food-image"><img src="${food.img}" alt="${food.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=700&q=80'"><span class="food-tag">${food.tag}</span></div>
      <div class="food-info">
        <div class="food-title-row"><h3 class="food-title">${food.name}</h3><span class="food-rating">★ ${food.rating}</span></div>
        <p class="food-description">${food.desc}</p>
        <div class="food-bottom"><span class="price">₹${food.price}</span><button class="add-button" aria-label="Add ${food.name} to cart" onclick="addToCart(${food.id})">+</button></div>
      </div>
    </article>`).join("") : `<p class="empty-results">No dishes found. Try another search.</p>`;
}

function addToCart(id) {
  const food = foods.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);
  existing ? existing.qty++ : cart.push({...food, qty:1});
  renderCart();
  showToast(`${food.name} added to cart`);
}
function changeQty(id, delta) {
  const item = cart.find(item => item.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(item => item.id !== id);
  renderCart();
}
function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.qty,0);
  const total = cart.reduce((sum,item) => sum + item.price*item.qty,0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("subtotal").textContent = `₹${total}`;
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = cart.length ? cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=200&q=80'">
      <div><h4>${item.name}</h4><small>₹${item.price} each</small><div class="quantity"><button onclick="changeQty(${item.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${item.id},1)">+</button></div></div>
      <span class="cart-item-price">₹${item.price*item.qty}</span>
    </div>`).join("") : `<div class="empty-cart">Your cart is empty.<br><span>Add something tasty!</span> 🍜</div>`;
}
function openCart(){cartPanel.classList.add("open");overlay.classList.add("show");document.body.style.overflow="hidden"}
function closeCart(){cartPanel.classList.remove("open");overlay.classList.remove("show");document.body.style.overflow=""}
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200)}

document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
searchInput.addEventListener("input",renderFoods);
document.getElementById("categories").addEventListener("click",event=>{
  const button=event.target.closest(".category"); if(!button)return;
  activeCategory=button.dataset.category;
  document.querySelectorAll(".category").forEach(item=>item.classList.toggle("active",item===button));
  renderFoods();
});
document.getElementById("checkoutButton").addEventListener("click",()=>{
  if(!cart.length){showToast("Your cart is empty — add a dish first!");return;}
  const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  alert(`Order summary\n${cart.map(item=>`${item.name} × ${item.qty}`).join("\n")}\n\nSubtotal: ₹${total}\n\nThis is a demo checkout. No payment is processed.`);
});
renderFoods();renderCart();
