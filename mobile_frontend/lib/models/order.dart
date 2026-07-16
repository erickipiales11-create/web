class Order {
  final int id;
  final int patientId;
  final int pharmacyId;
  final int medicineId;
  final int quantity;
  final String status;
  final double total;
  final String? prescriptionImage;
  final bool requiresPrescription;
  final DateTime? pickupDate;
  final String? notes;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String? pharmacyName;
  final String? medicineName;
  final double? medicinePrice;

  Order({
    required this.id,
    required this.patientId,
    required this.pharmacyId,
    required this.medicineId,
    required this.quantity,
    required this.status,
    required this.total,
    this.prescriptionImage,
    this.requiresPrescription = false,
    this.pickupDate,
    this.notes,
    required this.createdAt,
    required this.updatedAt,
    this.pharmacyName,
    this.medicineName,
    this.medicinePrice,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] ?? 0,
      patientId: json['patient_id'] ?? 0,
      pharmacyId: json['pharmacy_id'] ?? 0,
      medicineId: json['medicine_id'] ?? 0,
      quantity: json['quantity'] ?? 1,
      status: json['status'] ?? 'pending',
      total: json['total'] != null ? double.parse(json['total'].toString()) : 0.0,
      prescriptionImage: json['prescription_image'],
      requiresPrescription: json['requires_prescription'] ?? false,
      pickupDate: json['pickup_date'] != null ? DateTime.parse(json['pickup_date']) : null,
      notes: json['notes'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      pharmacyName: json['pharmacy']?['name'],
      medicineName: json['medicine']?['name'],
      medicinePrice: json['medicine']?['price'] != null ? double.parse(json['medicine']['price'].toString()) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'patient_id': patientId,
      'pharmacy_id': pharmacyId,
      'medicine_id': medicineId,
      'quantity': quantity,
      'status': status,
      'total': total,
      'prescription_image': prescriptionImage,
      'requires_prescription': requiresPrescription,
      'pickup_date': pickupDate?.toIso8601String(),
      'notes': notes,
    };
  }
}