/* Part 3 interactions: mobile menu, content search, image lightbox and form validation. */
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navigation");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("is-open"); menu.setAttribute("aria-expanded","false");
      menu.setAttribute("aria-label","Open navigation menu");
    }));
  }

  const search = document.querySelector(".site-search");
  const input = document.querySelector("#site-search-input");
  const status = document.querySelector("#search-status");
  if (search && input) {
    search.addEventListener("submit", e => {
      e.preventDefault();
      const q = input.value.trim().toLowerCase();
      const items = [...document.querySelectorAll("[data-searchable]")];
      let count = 0;
      items.forEach(el => {
        el.classList.remove("search-highlight");
        if (!q) { el.classList.remove("search-hidden"); return; }
        const match = el.innerText.toLowerCase().includes(q);
        el.classList.toggle("search-hidden", !match);
        if (match) { count++; el.classList.add("search-highlight"); }
      });
      if (status) status.textContent = !q ? "Search cleared; all content is visible." :
        count ? `${count} matching section(s) found on this page.` :
        "No matches on this page. Try another keyword or open a different page.";
      if (q && count) document.querySelector("[data-searchable]:not(.search-hidden)")?.scrollIntoView({behavior:"smooth",block:"center"});
    });
    input.addEventListener("input", () => {
      if (!input.value.trim()) {
        document.querySelectorAll("[data-searchable]").forEach(el => el.classList.remove("search-hidden","search-highlight"));
        if(status) status.textContent="";
      }
    });
  }

  const dialog = document.querySelector("#image-lightbox");
  if (dialog && dialog.showModal) {
    const img = dialog.querySelector("img"), caption = dialog.querySelector(".lightbox-caption");
    document.querySelectorAll("main img").forEach(image => image.addEventListener("click", () => {
      img.src=image.src; img.alt=image.alt; caption.textContent=image.alt || "Wildlife image"; dialog.showModal();
    }));
    dialog.querySelector(".lightbox-close").addEventListener("click",()=>dialog.close());
    dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
  }

  document.querySelectorAll(".ajax-form").forEach(form => {
    const feedback=form.querySelector(".form-feedback");
    form.querySelectorAll("input,select,textarea").forEach(field=>field.addEventListener("input",()=>field.setAttribute("aria-invalid",String(!field.checkValidity()))));
    form.addEventListener("submit",e=>{
      e.preventDefault();
      if(!form.checkValidity()){
        form.reportValidity();
        if(feedback){feedback.textContent="Please check the required fields and correct invalid entries.";feedback.className="form-feedback error";}
        form.querySelector(":invalid")?.focus();return;
      }
      if(feedback){feedback.textContent="Validation successful. This demo does not send your information; a secure server-side endpoint is needed for live submissions.";feedback.className="form-feedback success";}
    });
    form.addEventListener("reset",()=>{if(feedback){feedback.textContent="";feedback.className="form-feedback";}});
  });
});
