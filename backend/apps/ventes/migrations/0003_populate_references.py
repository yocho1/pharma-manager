"""Data migration to populate reference field for existing ventes."""

import datetime

from django.db import migrations


def populate_references(apps, schema_editor):
    """Generate VNT-YYYY-NNNN references for existing ventes."""
    Vente = apps.get_model("ventes", "Vente")
    year = datetime.date.today().year
    for seq, vente in enumerate(Vente.objects.order_by("id"), start=1):
        vente.reference = f"VNT-{year}-{seq:04d}"
        vente.save(update_fields=["reference"])


class Migration(migrations.Migration):

    dependencies = [
        ("ventes", "0002_add_reference_notes_fields"),
    ]

    operations = [
        migrations.RunPython(populate_references, migrations.RunPython.noop),
    ]
