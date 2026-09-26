(function () {
  var faixas = {
    1: [250, 450],
    2: [450, 800],
    3: [750, 1250],
    4: [1100, 1900],
  };
  var fmt = function (v) {
    return Math.round(v).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  };

  var header = document.querySelector("header");
  var onScroll = function () {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document
    .getElementById("btnVerificar")
    .addEventListener("click", function () {
      var nome = document.getElementById("fNome").value.trim();
      var zap = document.getElementById("fZap").value.trim();
      var err = document.getElementById("fError");
      if (!nome || zap.replace(/\D/g, "").length < 10) {
        err.style.display = "block";
        return;
      }
      err.style.display = "none";

      document.getElementById("stForm").style.display = "none";
      document.getElementById("stAnalysis").style.display = "block";

      var steps = ["as1", "as2", "as3", "as4"];
      steps.forEach(function (id, i) {
        setTimeout(
          function () {
            document.getElementById(id).classList.add("active");
            if (i > 0)
              document
                .getElementById(steps[i - 1])
                .classList.replace("active", "done");
          },
          400 + i * 850,
        );
      });
      setTimeout(
        function () {
          document.getElementById("as4").classList.replace("active", "done");
        },
        400 + steps.length * 850,
      );

      setTimeout(showResult, 600 + steps.length * 850);
    });

  function showResult() {
    var nome = document.getElementById("fNome").value.trim().split(" ")[0];
    var vinc = document.getElementById("fVinc").value;
    var renda = parseInt(document.getElementById("fRenda").value, 10);
    var anos = parseInt(document.getElementById("fAnos").value, 10);
    var fx = faixas[renda],
      meses = anos * 12;
    var subMin = fx[0] * meses,
      subMax = fx[1] * meses;
    var selMin = subMin * 0.15,
      selMax = subMax * 0.15;
    var totMin = subMin + selMin,
      totMax = subMax + selMax;

    document.getElementById("rNome").textContent = nome;
    document.getElementById("rExc").textContent =
      fmt(fx[0]) + " – " + fmt(fx[1]);
    document.getElementById("rMeses").textContent = meses + " meses";
    document.getElementById("rSelic").textContent =
      "+ " + fmt(selMin) + " – " + fmt(selMax);
    document.getElementById("rTotal").textContent =
      fmt(totMin) + " – " + fmt(totMax);

    var msg =
      "Olá! Sou " +
      document.getElementById("fNome").value.trim() +
      ", fiz a verificação no site: " +
      vinc +
      " vínculos, " +
      anos +
      " ano(s) na situação. Estimativa: " +
      fmt(totMin) +
      " a " +
      fmt(totMax) +
      ". Quero a análise gratuita do meu CNIS. Meu WhatsApp: " +
      document.getElementById("fZap").value;
    document.getElementById("rWa").href =
      "https://wa.me/5581999898760?text=" + encodeURIComponent(msg);

    document.getElementById("stAnalysis").style.display = "none";
    document.getElementById("stResult").style.display = "block";
  }

  document.getElementById("rAgain").addEventListener("click", function () {
    document.getElementById("stResult").style.display = "none";
    ["as1", "as2", "as3", "as4"].forEach(function (id) {
      document.getElementById(id).classList.remove("active", "done");
    });
    document.getElementById("stForm").style.display = "block";
  });

  // Fundo do hero: uma coluna por mês; o trecho acima do teto fica laranja
  // (cópia recortada acima da linha). O estilo e as animações estão em style.css.
  var heroAnim = document.querySelector(".hero-anim");
  if (heroAnim) {
    var NS = "http://www.w3.org/2000/svg";
    var svgEl = function (tag, attrs, parent) {
      var e = document.createElementNS(NS, tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      parent.appendChild(e);
      return e;
    };
    var drawTeto = function (intro) {
      var w = heroAnim.clientWidth,
        h = heroAnim.clientHeight;
      var seed = 7;
      var rand = function () {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      heroAnim.innerHTML = "";
      heroAnim.classList.toggle("no-intro", !intro);
      var svg = svgEl("svg", { viewBox: "0 0 " + w + " " + h, preserveAspectRatio: "none" }, heroAnim);
      var lineY = Math.round(h * 0.64);
      var clip = svgEl("clipPath", { id: "acimaDoTeto" }, svgEl("defs", {}, svg));
      svgEl("rect", { x: 0, y: 0, width: w, height: lineY }, clip);
      var base = svgEl("g", { class: "bars-base" }, svg);
      var over = svgEl("g", { class: "bars-over", "clip-path": "url(#acimaDoTeto)" }, svg);
      var gap = w > 900 ? 20 : 14,
        bw = 3,
        level = 0.3;
      for (var i = 0; i < Math.floor(w / gap); i++) {
        level = Math.min(0.54, Math.max(0.12, level + (rand() - 0.47) * 0.14));
        var bh = h * level,
          x = i * gap + (gap - bw) / 2;
        var rise = "animation-delay:" + (100 + i * 12) + "ms";
        var breathe = "animation-delay:" + -rand() * 2.2 + "s";
        [base, over].forEach(function (g) {
          var bar = svgEl("g", { class: "bar", style: rise }, g);
          svgEl("rect", { class: "breathe", x: x, y: h - bh, width: bw, height: bh, rx: bw / 2, style: breathe }, bar);
        });
      }
      svgEl("line", { class: "teto-line", x1: 0, x2: w, y1: lineY, y2: lineY }, svg);
      svgEl("text", { class: "teto-label", x: w - 16, y: lineY - 10, "text-anchor": "end" }, svg).textContent =
        "Teto do INSS";
    };
    drawTeto(true);
    // Redesenha sem repetir a entrada quando o hero muda de tamanho
    // (janela redimensionada, ou troca entre formulário e resultado).
    var lastSize = heroAnim.clientWidth + "x" + heroAnim.clientHeight;
    if (window.ResizeObserver) {
      var redraw;
      new ResizeObserver(function () {
        var size = heroAnim.clientWidth + "x" + heroAnim.clientHeight;
        if (size === lastSize) return;
        lastSize = size;
        clearTimeout(redraw);
        redraw = setTimeout(function () {
          drawTeto(false);
        }, 150);
      }).observe(heroAnim);
    }
  }
})();
