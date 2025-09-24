"""
Rotas para APIs externas (CNPJ, CEP, WhatsApp)
"""
from flask import Blueprint, request, jsonify
from services.external_apis import ExternalAPIService

external_apis_bp = Blueprint('external_apis', __name__)
api_service = ExternalAPIService()


@external_apis_bp.route('/cnpj/<cnpj>', methods=['GET'])
def consultar_cnpj(cnpj):
    """Consulta dados de CNPJ"""
    try:
        result = api_service.consultar_cnpj(cnpj)
        
        if result['success']:
            return jsonify({
                'success': True,
                'data': result['data']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500


@external_apis_bp.route('/cep/<cep>', methods=['GET'])
def consultar_cep(cep):
    """Consulta dados de CEP"""
    try:
        result = api_service.consultar_cep(cep)
        
        if result['success']:
            return jsonify({
                'success': True,
                'data': result['data']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500


@external_apis_bp.route('/whatsapp/link', methods=['POST'])
def gerar_link_whatsapp():
    """Gera link do WhatsApp para um número"""
    try:
        data = request.get_json()
        
        if not data or 'phone' not in data:
            return jsonify({
                'success': False,
                'error': 'Número de telefone é obrigatório'
            }), 400
        
        phone = data['phone']
        message = data.get('message', '')
        
        if not phone.strip():
            return jsonify({
                'success': False,
                'error': 'Número de telefone não pode estar vazio'
            }), 400
        
        link = api_service.gerar_link_whatsapp(phone, message)
        
        return jsonify({
            'success': True,
            'data': {
                'whatsapp_url': link,
                'phone_formatted': api_service.format_phone_for_whatsapp(phone)
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erro interno: {str(e)}'
        }), 500


@external_apis_bp.route('/validate/cnpj/<cnpj>', methods=['GET'])
def validar_cnpj(cnpj):
    """Valida formato de CNPJ"""
    try:
        cnpj_clean = api_service.clean_cnpj(cnpj)
        
        if len(cnpj_clean) != 14:
            return jsonify({
                'valid': False,
                'error': 'CNPJ deve conter 14 dígitos'
            }), 200
        
        # Validação básica de CNPJ (algoritmo de verificação)
        def validar_cnpj_algoritmo(cnpj_str):
            """Valida CNPJ usando algoritmo de verificação"""
            if len(cnpj_str) != 14:
                return False
            
            # Verifica se todos os dígitos são iguais
            if cnpj_str == cnpj_str[0] * 14:
                return False
            
            # Calcula primeiro dígito verificador
            soma = 0
            multiplicador = 5
            for i in range(12):
                soma += int(cnpj_str[i]) * multiplicador
                multiplicador -= 1
                if multiplicador < 2:
                    multiplicador = 9
            
            resto = soma % 11
            digito1 = 0 if resto < 2 else 11 - resto
            
            if int(cnpj_str[12]) != digito1:
                return False
            
            # Calcula segundo dígito verificador
            soma = 0
            multiplicador = 6
            for i in range(13):
                soma += int(cnpj_str[i]) * multiplicador
                multiplicador -= 1
                if multiplicador < 2:
                    multiplicador = 9
            
            resto = soma % 11
            digito2 = 0 if resto < 2 else 11 - resto
            
            return int(cnpj_str[13]) == digito2
        
        is_valid = validar_cnpj_algoritmo(cnpj_clean)
        
        return jsonify({
            'valid': is_valid,
            'cnpj_formatted': f"{cnpj_clean[:2]}.{cnpj_clean[2:5]}.{cnpj_clean[5:8]}/{cnpj_clean[8:12]}-{cnpj_clean[12:14]}"
        }), 200
        
    except Exception as e:
        return jsonify({
            'valid': False,
            'error': f'Erro na validação: {str(e)}'
        }), 500


@external_apis_bp.route('/validate/cep/<cep>', methods=['GET'])
def validar_cep(cep):
    """Valida formato de CEP"""
    try:
        cep_clean = api_service.clean_cep(cep)
        
        if len(cep_clean) != 8:
            return jsonify({
                'valid': False,
                'error': 'CEP deve conter 8 dígitos'
            }), 200
        
        # Verifica se todos os dígitos são iguais (CEP inválido)
        if cep_clean == cep_clean[0] * 8:
            return jsonify({
                'valid': False,
                'error': 'CEP inválido'
            }), 200
        
        return jsonify({
            'valid': True,
            'cep_formatted': f"{cep_clean[:5]}-{cep_clean[5:]}"
        }), 200
        
    except Exception as e:
        return jsonify({
            'valid': False,
            'error': f'Erro na validação: {str(e)}'
        }), 500

