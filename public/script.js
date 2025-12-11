document.getElementById("flamesForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name1 = document.getElementById("name1").value;
  const name2 = document.getElementById("name2").value;

  const res = await fetch("/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name1, name2 })
  });

  const data = await res.json();
  document.getElementById("output").innerText = "Result: " + data.result;
});
