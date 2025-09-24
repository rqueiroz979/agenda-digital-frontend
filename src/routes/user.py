from flask import Blueprint, request, jsonify
from src.models.user import User, db

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    """Obter todos os usuários"""
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """Obter um usuário específico"""
    try:
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@user_bp.route('/users', methods=['POST'])
def create_user():
    """Criar um novo usuário"""
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('email'):
            return jsonify({'error': 'Username e email são obrigatórios'}), 400
        
        user = User(
            username=data.get('username'),
            email=data.get('email')
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify(user.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

