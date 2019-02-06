# BelongsTo Field with Dependency

This package is based on the original [Orlyapps](https://github.com/orlyapps) package, which we do not know if is still under maintenance.

## Installation

You can install the package in to a Laravel app that uses [Nova](https://nova.laravel.com) via composer:

```bash
composer require emilianotisato/nova-belongsto-depends
```

Use this field in your Nova Resource

```php
// Add the use statement a the top of your nova resource
use EmilianoTisato\NovaBelongsToDepends\NovaBelongsToDepends;

// ...

public function fields(Request $request)
{
    return [
        ID::make()->sortable(),
        Text::make('Name')->rules('required', 'max:255'),

        NovaBelongsToDepends::make('Company')
            ->options(\App\Company::all()),
        NovaBelongsToDepends::make('Department')
            ->optionsResolve(function ($company) {
                // Reduce the amount of unnecessary data sent
                return $company->departments()->get(['id','name']);
            })
            ->dependsOn('Company'),
        NovaBelongsToDepends::make('Location')
            ->optionsResolve(function ($company) {
                // Reduce the amount of unnecessary data sent
                return $company->locations()->get(['id','name']);
            })
            ->dependsOn('Company'),

    ];
}
```

## Sample

-   Warehouse hasMany Articles
-   Articles belongsToMany Suppliers
-   Suppliers belongsToMany Articles

1. Select a **Warehouse** and get all articles of the warehouse
2. Select a **Article** and get all suppliers who has this article

```php
public function fields(Request $request)
{
    return [
        ID::make()->sortable(),
        Text::make('Name')->rules('required', 'max:255'),

        NovaBelongsToDepends::make('Warehouse')
        ->options(\App\Warehouse::all())
        ->rules('required'),
        NovaBelongsToDepends::make('Article')
            ->optionsResolve(function ($warehouse) {
                return $warehouse->articles;
            })
            ->dependsOn('Warehouse')
            ->rules('required'),
        NovaBelongsToDepends::make('Supplier')
            ->optionsResolve(function ($article) {
                return \App\Supplier::whereHas('articles', function ($q) use ($article) {
                    $q->where('article_id', $article->id);
                })->get();
            })
            ->dependsOn('Article')
            ->rules('required'),


    ];
}
```
## Use multiple instances

Some times you need to use multiple instances o mabye you have a second resource for the same eloquent model (example: App\Nova\User and App\Nova\Provider both represent App\User model). In those cases to avoid conflict you can delcare the specific Nova resources in meta attributes (`->withMeta(['calledFromClass' => 'App\Nova\Provider'])`) like this:

```php
            NovaBelongsToDepends::make('Client')
                ->options(\App\Client::all()),

            NovaBelongsToDepends::make('Provider')
                ->withMeta(['calledFromClass' => 'App\Nova\Provider'])
                ->optionsResolve(function ($client) {
                    return $client->providers()->active()->get(['id', 'name']);
                })->dependsOn('Client')
                ->rules('required'),

```

## Credits

-   Creator: [Orlyapps](https://github.com/orlyapps)
-   Mantainers: [Emiliano Tisato](https://github.com/emilianotisato)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
