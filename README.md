# Ensign

Generate beautiful, ultra-high-resolution social share images for your GitHub repositories directly in the browser.

Ensign fetches public repository metadata via the GitHub API and renders a customizable 2560x1280px preview card. Users can modify colors, upload custom local icons, and override text inputs. The final asset is exported as a PNG formatted exactly to GitHub's social preview specifications.

Everything runs completely client-side. There is no backend, no database, and no authentication required.

## How It Works

* Data Fetching: Queries the public GitHub API (/repos/{owner}/{repo}) to populate the initial repository details.

* Client-Side Generation: Uses html2canvas to parse the DOM and draw the elements onto an HTML canvas, which is then converted to a downloadable .png file.

## How to Use
Go to https://ensign.falak.me in your browser

## How to Launch

1. Clone the repository:

```
git clone https://github.com/yourusername/ensign.git
cd ensign
```
2. Install dependencies:
```
npm install
```
3. Run the development server:
```
npm run dev
```

Open the application: Navigate to http://localhost:3000 in your browser.

