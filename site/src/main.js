import "./style.css";
import "basecoat-css/all";
import Alpine from "alpinejs";
import { Client, ID, TablesDB } from "appwrite";

// Appwrite SDK initialization
const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("almost-vault");
const tables = new TablesDB(client);

// Encrypt functionality
Alpine.data("encrypt", () => ({
  secret: "",
  ttl: "day",
  reads: 1,

  creating: false,
  row: null,

  createRow: async function() {    
    if(this.creating) {
      return;
    }
    
    this.creating = true;
    
    try {
      this.row = await tables.createRow({
        databaseId: "main",
        tableId: "secrets",
        rowId: 'sec_' + ID.unique(),
        data: {
          secret: this.secret,
          ttl: this.ttl,
          reads: +this.reads,
        },
      });
      
      document.dispatchEvent(
        new CustomEvent("basecoat:toast", {
          detail: {
            config: {
              duration: 10000,
              category: "success",
              title: "Secret successfully created",
              description: 'ID: ' + this.row.$id,
              cancel: {
                label: "Close",
              },
            },
          },
        }),
      );
    } catch (err) {
      document.dispatchEvent(
        new CustomEvent("basecoat:toast", {
          detail: {
            config: {
              category: "error",
              title: "Could not store your secret",
              description: err.message ?? "Unknown error",
              cancel: {
                label: "Dismiss",
              },
            },
          },
        }),
      );
    } finally {
      this.creating = false;
    }
  },
}));

// Alpine.js core initialization
window.Alpine = Alpine;
Alpine.start();

// Accordion functionality
(() => {
  const accordions = document.querySelectorAll(".accordion");
  accordions.forEach((accordion) => {
    accordion.addEventListener("click", (event) => {
      const summary = event.target.closest("summary");
      if (!summary) return;
      const details = summary.closest("details");
      if (!details) return;
      accordion.querySelectorAll("details").forEach((detailsEl) => {
        if (detailsEl !== details) {
          detailsEl.removeAttribute("open");
        }
      });
    });
  });
})();
