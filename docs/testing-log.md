# CAR VAULT — Testing Log (Hamza Taqvim, 26I-3054)

Record manual browser tests (desktop and mobile) here before merging into `main`.

| Test ID | Page / Feature | Steps Taken | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| T-01 | Home -> Explore Navigation | Click `Explore Cars` CTA button on `index.html` | Navigates to `pages/explore-cars.html` | Pending Browser Check |
| T-02 | Home Brand Shortcut | Click `Honda` in Popular Brands on `index.html` | Opens `explore-cars.html?brand=Honda` with Honda pre-checked | Pending Browser Check |
| T-03 | Explore Search & Sort | Type `Civic` in search bar; change Sort to `Price: Low to High` | Filters matching cars and updates result count | Pending Browser Check |
| T-04 | Explore Filters & Empty State | Check `Hatchback` + `Rs. 1 Cr & above` and click `Apply` | Shows `"No matching cars found"` with working `Reset Filters` button | Pending Browser Check |
| T-05 | Car Details Gallery | Open `Honda Civic`, click thumbnail 2 and thumbnail 3 | Main image swaps and active border highlights selected thumbnail | Pending Browser Check |
| T-06 | Wishlist Persistence | Click `♡ Wishlist` on Car Details, reload page, open `Saved Cars` | Badge count stays `1`, button stays `♥ Saved in Wishlist`, car appears in modal | Pending Browser Check |
| T-07 | Booking Flow State 4 (Error) | Click `BOOK`, enter invalid phone (`123`) or email (`abc`), click `Submit` | Shows `"Incorrect phone number or email. Please enter again."` + `Try Again` | Pending Browser Check |
| T-08 | Booking Flow State 3 (Success) | Click `Try Again`, enter valid phone (`03001234567`) & email, submit | Shows `"Booking Confirmed!"` with car name, date, time, and `Back to Car` | Pending Browser Check |
| T-09 | Mobile Responsiveness | Resize browser to `375px` width on all 3 pages | Hamburger menu toggles, cards stack vertically, mobile filter drawer opens/closes | Pending Browser Check |
