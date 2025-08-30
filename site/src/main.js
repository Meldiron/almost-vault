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
  
   init() {
     // TODO: Implement
   },

  creating: false,
  row: null,

  copySecretId: async function() {
    if (!this.row?.$id) return;
    
    try {
      await navigator.clipboard.writeText(this.row.$id);
      document.dispatchEvent(
        new CustomEvent("basecoat:toast", {
          detail: {
            config: {
              category: "success",
              title: "Secret ID copied",
              description: "Secret ID has been copied to clipboard",
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
              title: "Failed to copy",
              description: "Could not copy secret ID to clipboard",
              cancel: {
                label: "Dismiss",
              },
            },
          },
        }),
      );
    }
  },

  copyShareableUrl: async function() {
    if (!this.row?.$id) return;
    
    const url = `http://almost-vault.appwrite.network/?id=${this.row.$id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      document.dispatchEvent(
        new CustomEvent("basecoat:toast", {
          detail: {
            config: {
              category: "success",
              title: "Shareable URL copied",
              description: "URL has been copied to clipboard",
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
              title: "Failed to copy",
              description: "Could not copy URL to clipboard",
              cancel: {
                label: "Dismiss",
              },
            },
          },
        }),
      );
    }
  },

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
