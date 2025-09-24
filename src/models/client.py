from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Client(db.Model):
    __tablename__ = 'clients'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    fantasy_name = db.Column(db.String(200))
    cnpj_cpf = db.Column(db.String(20))
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    phone2 = db.Column(db.String(20))
    mobile = db.Column(db.String(20))
    cep = db.Column(db.String(10))
    address = db.Column(db.String(300))
    number = db.Column(db.String(10))
    complement = db.Column(db.String(100))
    neighborhood = db.Column(db.String(100))
    city = db.Column(db.String(100))
    state = db.Column(db.String(2))
    country = db.Column(db.String(50), default='Brasil')
    company = db.Column(db.String(200))
    state_registration = db.Column(db.String(50))
    municipal_code = db.Column(db.String(20))
    country_code = db.Column(db.String(10), default='1058')
    teamviewer_id = db.Column(db.String(50))
    anydesk_id = db.Column(db.String(50))
    notes = db.Column(db.Text)
    contact_info = db.Column(db.Text)
    client_group = db.Column(db.String(100))
    vendor = db.Column(db.String(100))
    contract_type = db.Column(db.String(100))
    payment_type = db.Column(db.String(100))
    tax_regime = db.Column(db.String(100))
    monthly_fee = db.Column(db.String(20))
    last_purchase = db.Column(db.Date)
    sale_value = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'fantasy_name': self.fantasy_name,
            'cnpj_cpf': self.cnpj_cpf,
            'email': self.email,
            'phone': self.phone,
            'phone2': self.phone2,
            'mobile': self.mobile,
            'cep': self.cep,
            'address': self.address,
            'number': self.number,
            'complement': self.complement,
            'neighborhood': self.neighborhood,
            'city': self.city,
            'state': self.state,
            'country': self.country,
            'company': self.company,
            'state_registration': self.state_registration,
            'municipal_code': self.municipal_code,
            'country_code': self.country_code,
            'teamviewer_id': self.teamviewer_id,
            'anydesk_id': self.anydesk_id,
            'notes': self.notes,
            'contact_info': self.contact_info,
            'client_group': self.client_group,
            'vendor': self.vendor,
            'contract_type': self.contract_type,
            'payment_type': self.payment_type,
            'tax_regime': self.tax_regime,
            'monthly_fee': self.monthly_fee,
            'last_purchase': self.last_purchase.isoformat() if self.last_purchase else None,
            'sale_value': self.sale_value,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<Client {self.name}>'

