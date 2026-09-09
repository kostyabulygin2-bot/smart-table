import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => {
      // Перебираем по именам
      elements[elementName].append(
        // в каждый элемент добавляем опции
        ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
          .map((name) => {
            // используйте name как значение и текстовое содержимое
            const option = document.querySelector("option"); // @todo: создать и вернуть тег опции
            option.textContent = name;
            option.value = name;
            return option;
          }),
      );
    });
  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const parent = action.closest("filter-wrapper");
      const input = parent.querySelector("input");

      if (input) {
        input.value = "";
        state[input.name] = "";
      }
    }
    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter((row) => {
      return Object.keys(state).every((key) => {
        const filterValue = state[key];

        if (!filterValue || filterValue === "") {
          return true;
        }

        if (key === "totalFrom" || key === "totalTo") {
          const rowValue = parseFloat(row.total);
          const filterNumber = parseFloat(filterValue);

          if (isNaN(rowValue) || isNaN(filterNumber)) {
            return true;
          }

          if (key === "totalFrom") {
            return rowValue >= filterNumber;
          } else if (key === "totalTo") {
            return rowValue <= filterNumber;
          }
        }

        return compare(row, { [key]: filterValue });
      });
    });
  };
}
