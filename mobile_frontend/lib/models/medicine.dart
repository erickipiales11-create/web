class Medicine {
  final int id;
  final String name;
  final int? categoryId;
  final String? categoryName;
  final String? description;
  final double price;
  final int stock;
  final bool requiresPrescription;
  final String? gramaje;
  final String? tipo;
  final int? pharmacyId;
  final String? pharmacyName;
  final DateTime? expirationDate;
  final String? activeIngredient;
  final String? laboratory;
  final bool isActive;

  Medicine({
    required this.id,
    required this.name,
    this.categoryId,
    this.categoryName,
    this.description,
    required this.price,
    required this.stock,
    this.requiresPrescription = false,
    this.gramaje,
    this.tipo,
    this.pharmacyId,
    this.pharmacyName,
    this.expirationDate,
    this.activeIngredient,
    this.laboratory,
    this.isActive = true,
  });

  factory Medicine.fromJson(Map<String, dynamic> json) {
    return Medicine(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      categoryId: json['category_id'],
      categoryName: json['category']?['name'],
      description: json['description'],
      price: json['price'] != null ? double.parse(json['price'].toString()) : 0.0,
      stock: json['stock'] ?? 0,
      requiresPrescription: json['requires_prescription'] ?? false,
      gramaje: json['gramaje'],
      tipo: json['tipo'],
      pharmacyId: json['pharmacy_id'],
      pharmacyName: json['pharmacy']?['name'],
      expirationDate: json['expiration_date'] != null ? DateTime.parse(json['expiration_date']) : null,
      activeIngredient: json['active_ingredient'],
      laboratory: json['laboratory'],
      isActive: json['is_active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category_id': categoryId,
      'description': description,
      'price': price,
      'stock': stock,
      'requires_prescription': requiresPrescription,
      'gramaje': gramaje,
      'tipo': tipo,
      'pharmacy_id': pharmacyId,
      'expiration_date': expirationDate?.toIso8601String(),
      'active_ingredient': activeIngredient,
      'laboratory': laboratory,
      'is_active': isActive,
    };
  }
}