# RadiQ Healthcare website

Static marketing site for RadiQ Healthcare's teleradiology service. Plain HTML, CSS and JavaScript, with no build step and no dependencies.

## Structure

```
index.html              page markup
assets/css/styles.css   all styles (colour and font tokens at the top)
assets/js/main.js       tabs, form handling, scroll reveal, motion blur
assets/img/             logo, navigation logo, favicon
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Publish on GitHub Pages

1. Create a new repository on GitHub and push these files to the `main` branch.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, pick **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. The site goes live at `https://<username>.github.io/<repo>/` within a minute or two.
5. For your own domain, add it under **Custom domain** and point a CNAME record at `<username>.github.io`.

## Before launch

- **Placeholders:** every figure with a dotted gold underline (`class="tbc"`) is a placeholder: turnaround times, the critical-finding call time, free pilot, contact email, phone and city. Replace them, then remove the yellow DRAFT banner at the top of `index.html`.
- **Forms:** the forms send nothing until you set `FORM_ENDPOINT` at the top of `assets/js/main.js` to a form service URL (Formspree, Getform, Basin or your own backend). GitHub Pages cannot receive form submissions by itself.
- **Patient data:** the appointment form collects names and phone numbers, which is personal data under India's DPDP Act, 2023. Use a form service that stores data in a way you're comfortable being accountable for, and add a real privacy policy page before going live.
- **Privacy policy / Terms:** the footer links are text only; add those pages.
