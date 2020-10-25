## adding a new package
```
cd packages

mkdir <name>

ng new --commit=false --createApplication=false --directory=. <name>

ng generate library <name> --prefix=akrons-<name>

```
https://angular.io/guide/creating-libraries