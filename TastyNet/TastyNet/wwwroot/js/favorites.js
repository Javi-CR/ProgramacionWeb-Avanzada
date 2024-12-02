﻿// Manejo del boton para Crear Receta
document.getElementById('createRecipeButton').addEventListener('click', function () {
    const form = document.getElementById('createRecipeForm');
    const name = document.getElementById('recipeName').value.trim();
    const categoryId = document.getElementById('categoryId').value;
    const ingredientsInput = document.getElementById('ingredients').value.trim();
    const stepsInput = document.getElementById('steps').value.trim();

    // Validacion de campos del formulario
    form.classList.add('was-validated');
    if (!name || !categoryId || !ingredientsInput || !stepsInput) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
        // Validacion de formato de ingredientes
        const ingredients = ingredientsInput.split(';').map(item => {
            const [name, quantity] = item.split(',');
            if (!name || !quantity) {
                throw new Error("Formato de ingredientes incorrecto. Ejemplo: 'Harina, 2 tazas; Azúcar, 1 taza'");
            }
            return { Name: name.trim(), Quantity: quantity.trim() };
        });

        // Validacion de formato de pasos
        const steps = stepsInput.split(';').map((desc, index) => {
            if (!desc.trim()) {
                throw new Error("Formato de pasos incorrecto. Ejemplo: 'Mezclar los ingredientes; Hornear'");
            }
            return { StepNumber: index + 1, Description: desc.trim() };
        });

        // Enviar datos al servidor
        fetch('https://localhost:7044/api/Recetas/CrearReceta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name: name, CategoryId: categoryId, Ingredients: ingredients, Steps: steps }),
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || "Error en la creación de la receta");
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(data.Message);
                location.reload(); // Recargar la página para mostrar la receta nueva
            })
            .catch(err => alert(`Error: ${err.message}`));
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

            // Validar que data sea un array antes de procesarlo
            if (!Array.isArray(data)) {
                throw new Error("La respuesta no es un array válido.");
            }

            // Crear las cards para las recetas favoritas
            data.forEach(recipe => {
                // Validar que recipe tenga las propiedades esperadas
                if (!recipe || !recipe.Ingredients || !recipe.Steps) {
                    console.warn("Receta incompleta omitida:", recipe);
                    return;
                }

                const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title fw-bold">${recipe.Name || "Sin nombre"}</h5>
                                <p><strong>Ingredientes:</strong></p>
                                <ul>
                                    ${recipe.Ingredients.length
                        ? recipe.Ingredients.map(ing => `<li>${ing.Name || "Desconocido"}, ${ing.Quantity || ""}</li>`).join('')
                        : "<li>No hay ingredientes</li>"
                    }
                                </ul>
                                <p><strong>Pasos:</strong></p>
                                <ul>
                                    ${recipe.Steps.length
                        ? recipe.Steps.map(step => `<li>${step.Description || "Sin descripción"}</li>`).join('')
                        : "<li>No hay pasos</li>"
                    }
                                </ul>
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
        .catch(err => console.error('Error al cargar recetas favoritas:', err.message));
});


