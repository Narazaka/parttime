PartTime - time with placeholder
================================

SYNOPSYS
--------------------------------

JavaScript:
```javascript
var PartTime = require("parttime");
var parttime = new PartTime("*-01-01");
var now = new Date();
if (parttime.compare(now) == 0) console.log("Happy New Year!");
```

TypeScript:
```typescript
import PartTime = require("parttime");
const parttime = new PartTime("*-01-01");
const now = new Date();
if (parttime.compare(now) == 0) console.log("Happy New Year!");
```

In browser:
```html
<script src="parttime.js"></script>
<script>
var parttime = new PartTime("*-01-01");
var now = new Date();
if (parttime.compare(now) == 0) console.log("Happy New Year!");
</script>
```

DESCRIPTION
--------------------------------

PartTime represents a single moment in time with placeholder that is useful for compareing repeating moment.

Currently, PartTime does not support timezones.

```typescript
new PartTime()
new PartTime("*-10-12")
new PartTime("1970-1-1")
new PartTime("1970-1-1T00:*")
new PartTime("*:00:00.000")
new PartTime("*:*:30")
new PartTime("1970-1-1T00:00:00.000")
```

INSTALL
--------------------------------

### node.js

    npm install -g parttime

### browsers

Get parttime.js by downloading dist zip or some and

    <script src="parttime.js"></script>

API Document
--------------------------------

[API Document](https://narazaka.github.io/parttime/)

LICENSE
--------------------------------

(C) 2019 Narazaka : Licensed under [Zlib License](https://narazaka.net/license/Zlib?2019)
