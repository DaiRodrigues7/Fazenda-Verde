# Scripts SQL para Supabase - Fazenda Verde

## Tabela: vacinas

### Verificar se a tabela existe
```sql
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE  table_schema = 'public'
   AND    table_name   = 'vacinas'
);
```

### Criar tabela vacinas (se não existir)
```sql
CREATE TABLE IF NOT EXISTS public.vacinas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL,
    animal_tipo TEXT NOT NULL CHECK (animal_tipo IN ('vacas', 'cavalos', 'ovelhas')),
    nome_vacina TEXT NOT NULL,
    data_aplicacao DATE NOT NULL,
    proxima_dose DATE,
    observacao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_vacinas_user_id ON public.vacinas(user_id);
CREATE INDEX IF NOT EXISTS idx_vacinas_animal_id ON public.vacinas(animal_id);
CREATE INDEX IF NOT EXISTS idx_vacinas_animal_tipo ON public.vacinas(animal_tipo);
CREATE INDEX IF NOT EXISTS idx_vacinas_data_aplicacao ON public.vacinas(data_aplicacao);
```

### Habilitar RLS e criar políticas para vacinas
```sql
-- Habilitar Row Level Security
ALTER TABLE public.vacinas ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias vacinas
CREATE POLICY "Usuários podem ver suas vacinas"
ON public.vacinas FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuários podem inserir suas próprias vacinas
CREATE POLICY "Usuários podem inserir vacinas"
ON public.vacinas FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias vacinas
CREATE POLICY "Usuários podem atualizar vacinas"
ON public.vacinas FOR UPDATE
USING (auth.uid() = user_id);

-- Política: Usuários podem deletar suas próprias vacinas
CREATE POLICY "Usuários podem deletar vacinas"
ON public.vacinas FOR DELETE
USING (auth.uid() = user_id);
```

---

## Tabela: pesagens

### Verificar se a tabela existe
```sql
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE  table_schema = 'public'
   AND    table_name   = 'pesagens'
);
```

### Criar tabela pesagens (se não existir)
```sql
CREATE TABLE IF NOT EXISTS public.pesagens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    animal_id UUID NOT NULL,
    animal_tipo TEXT NOT NULL CHECK (animal_tipo IN ('vacas', 'cavalos', 'ovelhas')),
    peso NUMERIC(10, 2) NOT NULL,
    observacao TEXT,
    data_pesagem DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pesagens_user_id ON public.pesagens(user_id);
CREATE INDEX IF NOT EXISTS idx_pesagens_animal_id ON public.pesagens(animal_id);
CREATE INDEX IF NOT EXISTS idx_pesagens_animal_tipo ON public.pesagens(animal_tipo);
CREATE INDEX IF NOT EXISTS idx_pesagens_data_pesagem ON public.pesagens(data_pesagem);
```

### Habilitar RLS e criar políticas para pesagens
```sql
-- Habilitar Row Level Security
ALTER TABLE public.pesagens ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver apenas suas próprias pesagens
CREATE POLICY "Usuários podem ver suas pesagens"
ON public.pesagens FOR SELECT
USING (auth.uid() = user_id);

-- Política: Usuários podem inserir suas próprias pesagens
CREATE POLICY "Usuários podem inserir pesagens"
ON public.pesagens FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários podem atualizar suas próprias pesagens
CREATE POLICY "Usuários podem atualizar pesagens"
ON public.pesagens FOR UPDATE
USING (auth.uid() = user_id);

-- Política: Usuários podem deletar suas próprias pesagens
CREATE POLICY "Usuários podem deletar pesagens"
ON public.pesagens FOR DELETE
USING (auth.uid() = user_id);
```

---

## Storage Bucket: avatars

### Criar bucket no Supabase Storage

O bucket "avatars" precisa ser criado manualmente através do painel do Supabase, pois Storage não usa SQL.

**Passos para criar o bucket:**

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione o projeto "Fazenda Verde"
3. No menu lateral, clique em "Storage"
4. Clique em "New bucket"
5. Nome do bucket: `avatars`
6. Marque "Public bucket" (para permitir acesso público às imagens)
7. Clique em "Create bucket"

### Configurar políticas do bucket (RLS)

Após criar o bucket, configure as políticas de acesso:

1. No bucket "avatars", clique na aba "Policies"
2. Clique em "New Policy" → "Get started"
3. Selecione "Full custom" → "Use this template"
4. Para leitura pública (qualquer pessoa pode ver as fotos):
   - Nome: `Public read access`
   - Operação: `SELECT`
   - Usando: `(true)`
   - Clique em "Save"

5. Para upload restrito ao usuário autenticado:
   - Nome: `Authenticated upload`
   - Operação: `INSERT`
   - Usando: `(auth.uid() = user_id)` ou `(auth.role() = 'authenticated')`
   - Clique em "Save"

---

## Como executar os scripts

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione o projeto "Fazenda Verde"
3. No menu lateral, clique em "SQL Editor"
4. Clique em "New Query"
5. Copie e cole cada script SQL acima
6. Clique em "Run" para executar

**Ordem de execução:**
1. Primeiro, execute o script de verificação para cada tabela
2. Se a tabela não existir, execute o script de criação
3. Execute os scripts de RLS e políticas

**Importante:**
- Execute os scripts na ordem apresentada (vacinas primeiro, depois pesagens)
- Verifique se não há erros após cada execução
- As políticas RLS garantem que cada usuário só acesse seus próprios dados
