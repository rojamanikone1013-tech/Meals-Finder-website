
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const categoryDescription = document.getElementById("categoryDescription");

menuBtn.onclick = () => {
sidebar.classList.add("show");
};

closeBtn.onclick = () => {
sidebar.classList.remove("show");
};

const categoriesContainer =
document.getElementById("categoriesContainer");

const categoryList =
document.getElementById("categoryList");

const mealsContainer =
document.getElementById("mealsContainer");


// LOAD CATEGORIES

async function loadCategories(){

const res =
await fetch(
"https://www.themealdb.com/api/json/v1/1/categories.php"
);

const data = await res.json();

data.categories.forEach(category=>{

// GRID CARD

categoriesContainer.innerHTML += `
<div class="col-md-3">

<div
class="card category-card shadow"
onclick="getMeals('${category.strCategory}')">

<img
src="${category.strCategoryThumb}"
class="card-img-top">

<div class="card-body">

<h5 class="text-center fw-bold">
${category.strCategory}
</h5>

</div>

</div>

</div>
`;

// SIDEBAR ITEM

categoryList.innerHTML += `
<li
class="list-group-item py-3"
style="cursor:pointer"
onclick="getMeals('${category.strCategory}')">

${category.strCategory}

</li>
`;

});

}

loadCategories();


// CATEGORY MEALS

async function getMeals(category){

  sidebar.classList.remove("show");

  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );

  const data = await res.json();

  // categoriesContainer.parentElement.style.display = "none";

  mealsContainer.innerHTML = "";

 
  const catRes = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );

  const catData = await catRes.json();

  const selectedCategory = catData.categories.find(
    item => item.strCategory === category
  );

  if (selectedCategory) {
    mealsContainer.innerHTML = `
      <div class="col-12">
        <div class="border border-warning p-4 bg-white shadow-sm mb-4">
          <h3 class="fw-bold text-warning">
            ${selectedCategory.strCategory}
          </h3>
          <p>
            ${selectedCategory.strCategoryDescription}
          </p>
        </div>
      </div>
    `;
  }

  // Meals cards
  data.meals.forEach(meal => {

    mealsContainer.innerHTML += `
      <div class="col custom-col">

        <div class="card meal-card shadow">

          <img
            src="${meal.strMealThumb}"
            class="card-img-top">

          <div class="card-body">

            <h5 class="fw-bold">
              ${meal.strMeal}
            </h5>

            <button
              class="btn btn-warning w-100 mt-2"
              onclick="mealDetails('${meal.idMeal}')">

              View Details

            </button>

          </div>

        </div>

      </div>
    `;
  });

  window.scrollTo({
    top:700,
    behavior:"smooth"
  });
}

// SEARCH INPUT ENTER KEY

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keydown", function(e){

    if(e.key === "Enter"){
        searchMeals();
    }

});


// SEARCH

async function searchMeals(){

const food =
document.getElementById("searchInput").value;

const res =
await fetch(
`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`
);

const data = await res.json();


const hero = document.getElementById("heroSection");

if(data.meals && data.meals.length > 0){

    hero.style.backgroundImage =
    `url('${data.meals[0].strMealThumb}')`;

    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
}


// MEALS DISPLAY CODE

mealsContainer.innerHTML="";

if(!data.meals){

mealsContainer.innerHTML=`
<h2 class="text-center">
No Meals Found
</h2>
`;

return;
}

data.meals.forEach(meal=>{

mealsContainer.innerHTML += `
<div>
  <div class="card meal-card shadow">
    <img src="${meal.strMealThumb}" class="card-img-top">

    <div class="card-body">
      <h5 class="fw-bold">${meal.strMeal}</h5>

      <button
class="btn btn-warning w-100 mt-2"
onclick="mealDetails('${meal.idMeal}')">
View Details

</button>

<div id="details-${meal.idMeal}" class="mt-3"></div>
    </div>
  </div>
</div>
`;

});

}


// DETAILS
async function mealDetails(id){

    // Hide all sections
    document.getElementById("heroSection").style.display = "none";
    document.getElementById("mealsContainer").parentElement.style.display = "none";
    document.getElementById("categoriesContainer").parentElement.style.display = "none";

    // Show details section
    document.getElementById("mealDetailsSection").style.display = "block";

    const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    const data = await res.json();
    const meal = data.meals[0];

    const container = document.getElementById("mealDetailsContainer");

document.getElementById("heroSection").style.display = "none";
document.getElementById("mealsContainer").parentElement.style.display = "none";
document.getElementById("categoriesContainer").parentElement.style.display = "block";
document.getElementById("mealDetailsSection").style.display = "block";

if(!container) return;

/* INGREDIENTS */
let ingredientsHTML = "";
let measureHTML = "";

for(let i=1;i<=20;i++){

    let ingredient = meal[`strIngredient${i}`];
    let measure = meal[`strMeasure${i}`];

    if(ingredient && ingredient.trim()!=""){

        ingredientsHTML += `
        <div class="col-4 mb-2">
            <span class="badge rounded-pill bg-info">
                ${i}
            </span>
            ${ingredient}
        </div>
        `;

        measureHTML += `
        <div class="col-md-6 mb-2">
            🔑 ${measure}
        </div>
        `;
    }

}

/* Instructions */

let instructions = meal.strInstructions
.split(".")
.filter(step=>step.trim()!="");

let instructionHTML="";

instructions.forEach(step=>{

instructionHTML += `
<li class="list-group-item border-0">
    <i class="fa-regular fa-square-check text-warning me-2"></i>
    ${step.trim()}.
</li>
`;

});


container.innerHTML = `

<div class="breadcrumb-box">

<a href="#" onclick="goHome(); return false;">
<i class="fa-solid fa-house"></i> Home
</a>

<span class="mx-2">>></span>

<span>${meal.strMeal}</span>

</div>


<div class="card shadow border-0 p-4">

<div class="row">

<div class="col-lg-6">

<img src="${meal.strMealThumb}"
class="img-fluid rounded shadow">

</div>


<div class="col-lg-6">

<h2 class="text-warning fw-bold">
${meal.strMeal}
</h2>

<hr>

<p>
<b>CATEGORY :</b>
${meal.strCategory}
</p>

<p>
<b>AREA :</b>
${meal.strArea}
</p>

${meal.strSource ? `
<p>
<b>Source :</b>
<a href="${meal.strSource}" target="_blank">
Recipe Link
</a>
</p>
` : ""}

${meal.strTags ? `
<p>
<b>Tags :</b>
<span class="badge bg-warning text-dark">
${meal.strTags}
</span>
</p>
` : ""}


<div class="p-3 mt-4"
style="background:#f97316;color:white;border-radius:8px;">

<h5 class="fw-bold mb-3">
Ingredients
</h5>

<div class="row">

${ingredientsHTML}

</div>

</div>

</div>

</div>


<div class="mt-4">

<h5 class="fw-bold">
Measure
</h5>

<div class="border p-3">

<div class="row">

${measureHTML}

</div>

</div>

</div>


<div class="mt-4">

<h5 class="fw-bold">
Instructions
</h5>

<ul class="list-group">

${instructionHTML}

</ul>

</div>

</div>

`;


container.scrollIntoView({
    behavior: "smooth",
    block: "start"
});

document.getElementById("mealDetailsSection").scrollIntoView({
    behavior: "smooth"
});
}

function goHome(){

    document.getElementById("heroSection").style.display = "flex";
    document.getElementById("mealsContainer").parentElement.style.display = "block";
    document.getElementById("categoriesContainer").parentElement.style.display = "block";
    document.getElementById("mealDetailsSection").style.display = "none";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}