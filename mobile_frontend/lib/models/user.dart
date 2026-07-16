class User {
  final int id;
  final String email;
  final String name;
  final String role;
  final int? pharmacyId;
  final String? pharmacyName;
  final bool isActive;

  User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.pharmacyId,
    this.pharmacyName,
    this.isActive = true,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? 'patient',
      pharmacyId: json['pharmacy_id'],
      pharmacyName: json['pharmacy']?['name'],
      isActive: json['is_active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role,
      'pharmacy_id': pharmacyId,
      'is_active': isActive,
    };
  }
}