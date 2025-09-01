import './style.css';
import 'basecoat-css/all';
import Alpine from 'alpinejs';
import { Client, ID, TablesDB } from 'appwrite';

// Appwrite SDK initialization
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('almost-vault');
const tables = new TablesDB(client);

// Tabs functionality
Alpine.data('tabs', () => ({
  tab: 'encrypt',

  init() {
    this.autoFocus();
    this.$watch('tab', () => {
      this.autoFocus();
    });

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id && id.trim() !== '') {
      this.tab = 'decrypt';
    }
  },

  autoFocus() {
    Alpine.nextTick(() => {
      if (this.tab === 'encrypt') {
        document.getElementById('secret')?.focus();
      } else if (this.tab === 'decrypt') {
        document.getElementById('secret-id')?.focus();
      }
    }, 0);
  },
}));

// Encrypt functionality
Alpine.data('encrypt', () => ({
  secret: '',
  ttl: 'day',
  reads: 1,

  creating: false,
  row: null,

  copySecretId: async function () {
    if (!this.row?.$id) return;

    await navigator.clipboard.writeText(this.row.$id);
    document.dispatchEvent(
      new CustomEvent('basecoat:toast', {
        detail: {
          config: {
            category: 'success',
            title: 'Secret ID copied to clipboard',
            cancel: {
              label: 'Close',
            },
          },
        },
      })
    );
  },

  copyShareableUrl: async function () {
    if (!this.row?.$id) return;

    const url = window.location.origin + `/?id=${this.row.$id}`;

    await navigator.clipboard.writeText(url);
    document.dispatchEvent(
      new CustomEvent('basecoat:toast', {
        detail: {
          config: {
            category: 'success',
            title: 'Shareable URL copied to clipboard',
            cancel: {
              label: 'Close',
            },
          },
        },
      })
    );
  },

  createRow: async function () {
    if (this.creating) {
      return;
    }

    this.creating = true;

    try {
      const apiEndpoint =
        import.meta.env.VITE_API || 'https://almost-vault-api.fra.appwrite.run';
      const response = await fetch(
        `${apiEndpoint}/v1/cryptography/ciphertexts`,
        {
          method: 'POST',
          body: JSON.stringify({
            ttl: this.ttl,
            secret: this.secret,
            reads: +this.reads,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        const data = await response.json();
        this.row = data;

        document.dispatchEvent(
          new CustomEvent('basecoat:toast', {
            detail: {
              config: {
                category: 'success',
                title: 'Secret successfully created',
                description: 'ID: ' + this.row.$id,
                cancel: {
                  label: 'Close',
                },
              },
            },
          })
        );
      } else {
        throw new Error(await response.text());
      }
    } catch (err) {
      document.dispatchEvent(
        new CustomEvent('basecoat:toast', {
          detail: {
            config: {
              category: 'error',
              title: 'Could not store your secret',
              description: err.message ?? 'Unknown error',
              cancel: {
                label: 'Dismiss',
              },
            },
          },
        })
      );
    } finally {
      this.creating = false;
    }
  },
}));

// Decrypt functionality
Alpine.data('decrypt', () => ({
  id: '',
  secret: null,

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id && id.trim() !== '') {
      this.id = id;
    }
  },

  reading: false,

  forgetSecret() {
    this.secret = null;
  },

  getRow: async function () {
    if (this.reading) {
      return;
    }

    this.reading = true;

    try {
      const apiEndpoint =
        import.meta.env.VITE_API || 'https://almost-vault-api.fra.appwrite.run';
      const response = await fetch(
        `${apiEndpoint}/v1/cryptography/ciphertexts/${this.id}`,
        {
          method: 'GET',
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        this.secret = data;

        window.history.replaceState(null, '', window.location.pathname);
        this.id = '';

        document.dispatchEvent(
          new CustomEvent('basecoat:toast', {
            detail: {
              config: {
                category: 'success',
                title: 'Secret successfully decrypted',
                cancel: {
                  label: 'Close',
                },
              },
            },
          })
        );
      } else {
        throw new Error(await response.text());
      }
    } catch (err) {
      document.dispatchEvent(
        new CustomEvent('basecoat:toast', {
          detail: {
            config: {
              category: 'error',
              title: 'Could not read the secret',
              description: err.message ?? 'Unknown error',
              cancel: {
                label: 'Dismiss',
              },
            },
          },
        })
      );
    } finally {
      this.reading = false;
    }
  },
}));

// Simple button alert functionality
Alpine.data('articleAlert', () => ({
  showAlert() {
    document.dispatchEvent(
      new CustomEvent('basecoat:toast', {
        detail: {
          config: {
            category: 'info',
            title: 'Article coming soon',
            description: "I promise I won't forget. Not this time.",
            cancel: {
              label: 'Close',
            },
          },
        },
      })
    );
  },
}));

// Alpine.js core initialization
window.Alpine = Alpine;
Alpine.start();

// Accordion functionality
(() => {
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(accordion => {
    accordion.addEventListener('click', event => {
      const summary = event.target.closest('summary');
      if (!summary) return;
      const details = summary.closest('details');
      if (!details) return;
      accordion.querySelectorAll('details').forEach(detailsEl => {
        if (detailsEl !== details) {
          detailsEl.removeAttribute('open');
        }
      });
    });
  });
})();
