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
    } else if (control.value === "status") {
      ordered.sort((first, second) =>
        byName(first.cells[columns.status].textContent, second.cells[columns.status].textContent)
        || compareNames(first, second)
      );
    } else if (["members", "approvals", "comments"].includes(control.value)) {
      const key = control.value;
      ordered.sort((first, second) =>
        numericValue(second, key, -1) - numericValue(first, key, -1)
        || compareNames(first, second)
      );
    } else if (["number", "sequence"].includes(control.value)) {
      const key = control.value;
      ordered.sort((first, second) =>
        numericValue(first, key, Infinity) - numericValue(second, key, Infinity)
      );
    }
    body.append(...ordered);
  }

  control.addEventListener("change", sortRows);
  sortRows();
  control.closest(".sort").hidden = false;
}
