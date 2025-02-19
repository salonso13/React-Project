from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from .serializers import GeminiInputSerializer
from .models import Chat
import google.generativeai as genai





# Configurar API key
genai.configure(api_key=settings.GOOGLE_API_KEY)

# Configurar el modelo
model = genai.GenerativeModel('gemini-pro')

# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class GeminiAPIView(APIView):
    def post(self, request):
        try:
            serializer = GeminiInputSerializer(data=request.data)
            if serializer.is_valid():
                prompt = serializer.validated_data['prompt'].strip()
                if not prompt:
                    return Response({
                        'error': 'El prompt no puede estar vacío'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                response = model.generate_content(prompt)
                
                chat = Chat.objects.create(
                    prompt=prompt,
                    response=response.text
                )
                
                return Response({
                    'prompt': prompt,
                    'response': response.text
                }, status=status.HTTP_200_OK)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Exception as e:
            return Response({
                'error': f'Error del servidor: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)