﻿// Manejo del boton para Crear Receta
document.getElementById('createRecipeButton').addEventListener('click', function () {
    const form = document.getElementById('createRecipeForm');
    const name = document.getElementById('recipeName').value.trim();
    const categoryId = parseInt(document.getElementById('categoryId').value);
    const ingredientsInput = document.getElementById('ingredients').value.trim();
    const stepsInput = document.getElementById('steps').value.trim();

    form.classList.add('was-validated');
    if (!name || !categoryId || !ingredientsInput || !stepsInput) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
        const ingredients = ingredientsInput.split(';').map(item => {
            const [name, quantity] = item.split(',');
            if (!name || !quantity) {
                throw new Error("Formato de ingredientes incorrecto. Ejemplo: 'Harina, 2 tazas; Azúcar, 1 taza'");
            }
            return { Name: name.trim(), Quantity: quantity.trim() };
        });

        const steps = stepsInput.split(';').map((desc, index) => {
            if (!desc.trim()) {
                throw new Error("Formato de pasos incorrecto. Ejemplo: 'Mezclar los ingredientes; Hornear'");
            }
            return { StepNumber: index + 1, Description: desc.trim() };
        });

        fetch('https://localhost:7044/api/Recetas/CrearReceta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name: name, CategoryId: categoryId, Ingredients: ingredients, Steps: steps }),
        })
            .then(response => {
                if (!response.ok) return response.text().then(text => { throw new Error(text); });
                return response.json();
            })
            .then(data => {
                alert(data.Message);
                location.reload(); // Recargar la página tras crear la receta
            })
            .catch(err => alert(`Error al crear receta: ${err.message}`));
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
});


// Función para cargar las recetas favoritas del usuario
document.addEventListener("DOMContentLoaded", () => {
    fetch('https://localhost:7044/api/Recetas/ObtenerRecetasFavoritas?userId=1')
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener recetas favoritas");
            return response.json();
        })
        .then(data => {
            const recipeCards = document.getElementById('recipeCards');
            recipeCards.innerHTML = '';

            // Asegurarse de que la respuesta tiene la propiedad $values y es un array
            if (!data || !data.$values || !Array.isArray(data.$values)) {
                console.error("La respuesta no contiene datos válidos.");
                return;
            }

            const recipes = data.$values;

            // Crear las cards para las recetas favoritas
            recipes.forEach(recipe => {
                // Validar que recipe tenga las propiedades esperadas
                if (!recipe || !recipe.recipeName || !recipe.categoryName) {
                    console.warn("Receta incompleta omitida:", recipe);
                    return;
                }

                const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">${recipe.recipeName}</h5>
                                <p><strong>Categoría:</strong> ${recipe.categoryName}</p>
                                <p><strong>Ingrediente:</strong> ${recipe.ingredientName || "No especificado"}, ${recipe.ingredientQuantity || ""}</p>
                                <p><strong>Paso ${recipe.stepNumber}:</strong> ${recipe.stepDescription || "Sin descripción"}</p>
                                <div class="d-flex justify-content-between">
                                    <button class="btn btn-warning text-white btn-sm">Editar</button>
                                    <button class="btn btn-danger text-white btn-sm">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                recipeCards.innerHTML += card;
            });
        })
        .catch(err => console.error('Error al cargar recetas favoritas:', err));
});




