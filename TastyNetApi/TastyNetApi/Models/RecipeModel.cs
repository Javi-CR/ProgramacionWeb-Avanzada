﻿using System.Text.Json.Serialization;

namespace TastyNetApi.Models
{
    public class Recipe
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public long CategoryId { get; set; }
        public long UserId { get; set; }

        public Category? Category { get; set; }
        
        [JsonIgnore] // Evitar ciclos con Favorites -> Recipe
        public ICollection<Favorite>? Favorites { get; set; }
        public ICollection<Ingredient>? Ingredients { get; set; }
        public ICollection<RecipeStep>? RecipeSteps { get; set; }
    }
}