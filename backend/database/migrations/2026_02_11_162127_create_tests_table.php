<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id(); // Auto-incrementing ID
        $table->string('name'); // Product Name
        $table->text('description')->nullable(); // Product Description
        $table->decimal('price', 8, 2); // Product Price (e.g., 99.99)
        $table->timestamps(); // Created_at and Updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
