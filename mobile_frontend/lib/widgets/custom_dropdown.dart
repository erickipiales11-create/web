import 'package:flutter/material.dart';

class CustomDropdown extends StatelessWidget {
  final String label;
  final List<Map<String, dynamic>> items;
  final dynamic value;
  final Function(dynamic) onChanged;
  final String? hint;
  final bool isRequired;

  const CustomDropdown({
    super.key,
    required this.label,
    required this.items,
    this.value,
    required this.onChanged,
    this.hint,
    this.isRequired = false,
  });

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<dynamic>(
      value: value,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor: Colors.grey[50],
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      ),
      hint: hint != null ? Text(hint!) : null,
      items: [
        if (!isRequired)
          const DropdownMenuItem<dynamic>(
            value: null,
            child: Text('Seleccionar...'),
          ),
        ...items.map((item) {
          return DropdownMenuItem<dynamic>(
            value: item['value'],
            child: Text(item['label']),
          );
        }),
      ],
      onChanged: onChanged,
      validator: (value) {
        if (isRequired && value == null) {
          return 'Selecciona una opción';
        }
        return null;
      },
    );
  }
}