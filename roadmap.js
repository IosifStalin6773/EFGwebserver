(function () {
	"use strict";

	// Estados: "done" = hecho en main, "wip" = en curso (PR abierto), "todo" = pendiente.
	var DONE = [
		{ area: "Raid", items: [
			"Despliegue, temporizador y 5 tipos de extracción",
			"MIA, Run Through, grupos y Scav run",
			"Registro del ciclo y /EFGTestCiclo"
		] },
		{ area: "Salud", items: [
			"Salud por partes, sangrados y fracturas (probado)",
			"Fisiología: sangre, SpO2, vía aérea, RCP (probado)",
			"Animaciones médicas: un arma por medicina con su animación"
		] },
		{ area: "Armas", items: [
			"ARC9 de EFT como objetos, balística y blindaje",
			"Cargadores como objetos y recarga instantánea en el escondite",
			"Desgaste, encasquillamientos y pantalla de modding"
		] },
		{ area: "Inventario y loot", items: [
			"TAB con ranuras, chalecos con bolsillos y acceso rápido",
			"EQUIPO con el diseño de EFT",
			"Loot de contenedores y cadáveres por tablas, ventana de saqueo"
		] },
		{ area: "Economía", items: [
			"8 comerciantes con lealtad 1-4, mercadillo y seguro",
			"Divisas RUB, EUR y USD en la cabecera del alijo",
			"Base de datos de objetos de EFT en JSON con iconos"
		] },
		{ area: "PMC e interfaz", items: [
			"Creador de PMC, perfil, 79 niveles y habilidades",
			"Pantalla de carga, menú de GMod, logo e insignias",
			"Launcher de EFG con aviso de addons por actualizar"
		] }
	];

	var WIP = [
		"Mapa del búnker del escondite con los 23 módulos",
		"Saqueo dentro de la pestaña EQUIPO",
		"Pestaña SALUD con el diseño de EFT",
		"EQUIPO usa el inventario DHTML por defecto"
	];

	var BARS = [
		{ name: "Raid y extracciones", v: 80 },
		{ name: "Salud y medicina", v: 95 },
		{ name: "Armas y balística", v: 85 },
		{ name: "Inventario y loot", v: 85 },
		{ name: "Economía y tareas", v: 60 },
		{ name: "Escondite", v: 70 },
		{ name: "IA y jefes", v: 40 },
		{ name: "Mapa jugable", v: 20 },
		{ name: "Probado en partida", v: 35 }
	];

	var PHASES = [
		{ id: "F0", title: "Núcleo", when: "Nov 2026", status: "next", items: [
			"Probar en GMod lo de #94, #95 y #96",
			"Raid en EFG_Mapa_v0_1: spawns, extracciones, IA y loot",
			"Escondite en el mapa y VRAD final",
			"VJ Base en la colección y clases con /IAClases",
			"Migración de la base de datos probada",
			"Partida completa de 2-4 jugadores"
		] },
		{ id: "F1", title: "Combate y red", when: "Dic 2026", status: "later", items: [
			"Granadas y cuerpo a cuerpo",
			"Tumbarse, inclinarse y oclusión de sonido",
			"Validación común de net.Receive",
			"Medir red y CPU, copias de la base de datos"
		] },
		{ id: "F2", title: "Contenido", when: "Ene-feb 2027", status: "later", items: [
			"Árbol completo de tareas y trueques",
			"Círculo sectario, maestría de armas y Kappa",
			"Precios de referencia del mercadillo",
			"Revisar los 65 valores [VERIFICAR]"
		] },
		{ id: "F3", title: "Limpieza de UI", when: "En paralelo", status: "parallel", items: [
			"Una sola UI de inventario",
			"Sustituir menu_ui por efg_ui",
			"Retirar loot, needs y mesa_crafteo duplicados"
		] },
		{ id: "F4", title: "Lanzamiento", when: "Mar 2027", status: "later", items: [
			"CI y versionado",
			"Publicar los packs en el Workshop",
			"Beta cerrada y release candidate",
			"Un wipe completo sin pérdidas: 1.0"
		] }
	];

	var STATUS_LABEL = { done: "Hecho", wip: "En curso", todo: "Pendiente" };

	function el(tag, cls, text) {
		var n = document.createElement(tag);
		if (cls) { n.className = cls; }
		if (text != null) { n.textContent = text; }
		return n;
	}

	function matches(text, q) {
		return !q || text.toLowerCase().indexOf(q) !== -1;
	}

	var state = { filter: "all", q: "" };

	function allowed(status) {
		return state.filter === "all" || state.filter === status;
	}

	function renderDone() {
		var box = document.getElementById("areas-done");
		box.innerHTML = "";
		if (!allowed("done")) { box.appendChild(el("p", "muted", "Nada en esta vista.")); return; }
		var shown = 0;
		DONE.forEach(function (g) {
			var items = g.items.filter(function (t) { return matches(t, state.q); });
			if (!items.length) { return; }
			shown += items.length;
			var card = el("article", "area");
			card.appendChild(el("h3", "", g.area));
			var ul = el("ul", "checks");
			items.forEach(function (t) {
				var li = el("li", "", t);
				ul.appendChild(li);
			});
			card.appendChild(ul);
			box.appendChild(card);
		});
		if (!shown) { box.appendChild(el("p", "muted", "Ningún resultado con este filtro.")); }
	}

	function renderWip() {
		var ul = document.getElementById("items-wip");
		ul.innerHTML = "";
		var list = allowed("wip") ? WIP.filter(function (t) { return matches(t, state.q); }) : [];
		if (!list.length) { ul.appendChild(el("li", "muted", "Nada en esta vista.")); return; }
		list.forEach(function (t) { ul.appendChild(el("li", "", t)); });
	}

	function renderBars() {
		var box = document.getElementById("bars");
		box.innerHTML = "";
		BARS.forEach(function (b) {
			var row = el("div", "bar-row");
			row.appendChild(el("span", "bar-name", b.name));
			var track = el("div", "bar");
			var fill = el("span", "");
			fill.style.width = b.v + "%";
			track.appendChild(fill);
			row.appendChild(track);
			row.appendChild(el("span", "bar-val", b.v + "%"));
			box.appendChild(row);
		});
	}

	function renderTimeline() {
		var ol = document.getElementById("timeline");
		ol.innerHTML = "";
		PHASES.forEach(function (p) {
			var li = el("li", "tl tl-" + p.status);
			li.appendChild(el("span", "tl-dot"));
			li.appendChild(el("span", "tl-when", p.when));
			li.appendChild(el("span", "tl-name", p.id + " " + p.title));
			ol.appendChild(li);
		});
	}

	function renderPhases() {
		var box = document.getElementById("phases");
		box.innerHTML = "";
		var any = false;
		PHASES.forEach(function (p, i) {
			var items = (allowed("todo") ? p.items : []).filter(function (t) { return matches(t, state.q); });
			if (!items.length && (state.q || state.filter !== "all")) { return; }
			any = true;
			var d = el("details", "phase phase-" + p.status);
			if (p.status === "next" || i === 0) { d.open = true; }
			var s = el("summary");
			s.appendChild(el("span", "phase-id", p.id));
			s.appendChild(el("span", "phase-title", p.title));
			s.appendChild(el("span", "phase-when", p.when));
			s.appendChild(el("span", "phase-count", items.length + " tareas"));
			d.appendChild(s);
			var ul = el("ul", "items");
			items.forEach(function (t) { ul.appendChild(el("li", "", t)); });
			d.appendChild(ul);
			box.appendChild(d);
		});
		if (!any) { box.appendChild(el("p", "muted", "Ningún resultado con este filtro.")); }
	}

	function renderOverall() {
		var sum = 0;
		BARS.forEach(function (b) { sum += b.v; });
		var pct = Math.round(sum / BARS.length);
		document.getElementById("overall-pct").textContent = pct + "%";
		document.getElementById("overall-bar").style.width = pct + "%";
	}

	function renderAll() {
		renderDone();
		renderWip();
		renderPhases();
	}

	function setup() {
		var chips = document.querySelectorAll(".chip");
		Array.prototype.forEach.call(chips, function (c) {
			c.addEventListener("click", function () {
				state.filter = c.getAttribute("data-filter");
				Array.prototype.forEach.call(chips, function (x) {
					x.classList.toggle("is-on", x === c);
				});
				renderAll();
			});
		});
		document.getElementById("search").addEventListener("input", function (e) {
			state.q = e.target.value.trim().toLowerCase();
			renderAll();
		});
		renderOverall();
		renderBars();
		renderTimeline();
		renderAll();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setup);
	} else {
		setup();
	}
})();
