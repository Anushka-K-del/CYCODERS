const food = document.querySelector("#food");
const quantity = document.querySelector("#quantity");
const analyze = document.querySelector("#analyze");
const result = document.querySelector("#result");

analyze.addEventListener("click", function() {

    if (food.value == "" || quantity.value == "") {
        result.innerHTML = "<p>Please enter food and quantity.</p>";
        return;
    }

    const foodName = food.value;
    const grams = Number(quantity.value);

    const url = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&query="
        + encodeURIComponent(foodName)
        + "&pageSize=1";

    result.innerHTML = "<p>🔎 Finding nutrition information...</p>";

    fetch(url)
        .then(response => response.json())
        .then(data => {

            if (data.foods.length == 0) {
                result.innerHTML = "<p>Food not found. Try another food.</p>";
                return;
            }

            const foodData = data.foods[0];

            let calories = 0;
            let protein = 0;
            let carbohydrates = 0;
            let fat = 0;
            let fiber = 0;

            foodData.foodNutrients.forEach(function(nutrient) {

                if (nutrient.nutrientId == 1008) {
                    calories = nutrient.value;
                }

                if (nutrient.nutrientId == 1003) {
                    protein = nutrient.value;
                }

                if (nutrient.nutrientId == 1005) {
                    carbohydrates = nutrient.value;
                }

                if (nutrient.nutrientId == 1004) {
                    fat = nutrient.value;
                }

                if (nutrient.nutrientId == 1079) {
                    fiber = nutrient.value;
                }
            });

            const multiplier = grams / 100;

            calories = (calories * multiplier).toFixed(1);
            protein = (protein * multiplier).toFixed(1);
            carbohydrates = (carbohydrates * multiplier).toFixed(1);
            fat = (fat * multiplier).toFixed(1);
            fiber = (fiber * multiplier).toFixed(1);

            result.innerHTML = `
                <h2>📊 Nutrition Result</h2>
                <p><strong>Food:</strong> ${foodData.description}</p>
                <p><strong>Quantity:</strong> ${grams} g</p>
                <p><strong>Calories:</strong> ${calories} kcal</p>
                <p><strong>Protein:</strong> ${protein} g</p>
                <p><strong>Carbohydrates:</strong> ${carbohydrates} g</p>
                <p><strong>Fat:</strong> ${fat} g</p>
                <p><strong>Fiber:</strong> ${fiber} g</p>
            `;
        })
        .catch(error => {
            console.log(error);
            result.innerHTML = "<p>Something went wrong. Please try again.</p>";
        });
});
