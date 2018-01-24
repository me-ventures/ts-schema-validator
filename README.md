# ts-schema-validator
validates typescript stuff at runtime!

# install
`yarn add @convenior/ts-schema-validator`

# basic usage

```typescript
            const provider = new SchemaValidatorProvider();

            const schemaProvider = new SchemaProvider({
                path: "test/samples/ISampleInterface.ts"
            });

            const schema = schemaProvider.getSchemaForSymbol("ISampleInterface");

            const sut = provider.getValidator(schema);

            const result: boolean = await sut.validate({
                booleanThing: true,
                numberThing: 123,
                stringThing: "abc"
            });

            Assert.isTrue(result);
```