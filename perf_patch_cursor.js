const fs = require('fs');

let css = fs.readFileSync('d:/web/style.css', 'utf8');

// The original CSS for cursor border is `#000` and the center is `#111`.
// We should change the border to `#fff` and center to `#fff` because difference blend with a white color over black (#000 footer) = white. White over white = black.
// Then uncomment mix-blend-mode difference.

css = css.replace(/border: 1\.5px solid #000; \/\* Viền mỏng tinh tế \*\//, 'border: 1.5px solid #fff; /* Viền mỏng tinh tế */');
css = css.replace(/background-color: #111;/, 'background-color: #fff;');
css = css.replace(/\/\* mix-blend-mode: difference; \*\//, 'mix-blend-mode: difference;');

// Fix .custom-cursor.hovered which sets background-color: #fff;
// This will work well with difference blend mode, but let's make sure opacity is a bit stronger
css = css.replace(/opacity: 0\.8; \/\* Hơi trong suốt một chút \*\//, 'opacity: 1; /* Hiển thị rõ ràng với mix-blend */');

fs.writeFileSync('d:/web/style.css', css, 'utf8');
console.log("Cursor CSS updated");
