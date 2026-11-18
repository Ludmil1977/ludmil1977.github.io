const byName = new Intl.Collator("bg", { sensitivity: "base" }).compare;

for (const control of document.querySelectorAll("select[data-sort-table]")) {
  const table = document.getElementById(control.dataset.sortTable);
  const body = table.tBodies[0];
  const rows = Array.from(body.rows);
  const columns = Object.fromEntries(
    Array.from(table.tHead.rows[0].cells)
      .filter(cell => cell.dataset.sortKey)
      .map(cell => [cell.dataset.sortKey, cell.cellIndex])
  );

  function numericValue(row, key, fallback) {
    const value = Number(row.cells[columns[key]].dataset.sortValue ?? row.cells[columns[key]].textContent);
    return Number.isFinite(value) ? value : fallback;
  }

  function compareNames(first, second) {
    return byName(first.cells[columns.name].textContent, second.cells[columns.name].textContent);
  }

  function sortRows() {
    const ordered = rows.slice();
    if (control.value === "name") {
      ordered.sort(compareNames);
    } else if (control.value === "members") {
      ordered.sort((first, second) =>
        numericValue(second, "members", -1) - numericValue(first, "members", -1)
        || compareNames(first, second)
      );
    } else if (control.value === "number") {
      ordered.sort((first, second) =>
        numericValue(first, "number", Infinity) - numericValue(second, "number", Infinity)
      );
    }
    body.append(...ordered);
  }

  control.addEventListener("change", sortRows);
  sortRows();
  control.closest(".sort").hidden = false;
}
