// src/compile2exe/compiler.cs
using System;
using System.IO;
using System.CodeDom.Compiler;
using Microsoft.CSharp;

namespace EsharpCompiler {
    class Program {
        static void Main(string[] args) {
            string exeName = args.Length > 0 ? args[0] : "app.exe";
            string htmlPath = args.Length > 1 ? args[1] : "index.html";

            Console.WriteLine($"Создаем десктопное приложение: {exeName} с HTML: {htmlPath}...");

            // Шаблон нативного C# приложения с WebView2 (весит считанные килобайты)
            string sourceCode = @"
using System;
using System.Windows.Forms;
using Microsoft.Web.WebView2.WinForms;

namespace EsharpApp {
    public class MainForm : Form {
        private WebView2 webView;

        public MainForm() {
            this.Text = """ + exeName.Replace(".exe", "") + @""";
            this.Width = 1024;
            this.Height = 768;
            this.StartPosition = FormStartPosition.CenterScreen;

            webView = new WebView2();
            webView.Dock = DockStyle.Fill;
            this.Controls.Add(webView);

            InitializeAsync();
        }

        async void InitializeAsync() {
            await webView.EnsureCoreWebView2Async();
            string htmlFullPath = Path.Combine(AppDomain.CurrentDomain.BaseAddress ?? AppDomain.CurrentDomain.BaseDirectory, """ + htmlPath + @""");
            if (File.Exists(htmlFullPath)) {
                webView.CoreWebView2.Navigate(new Uri(htmlFullPath).AbsoluteUri);
            } else {
                webView.CoreWebView2.NavigateToString(""<h2>HTML file not found.</h2>"");
            }
        }

        [STAThread]
        public static void Main() {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }
}
";

            // Компилируем в .exe с помощью встроенного компилятора C# (.NET Framework / Roslyn)
            // Это работает прямо из коробки на Windows без тяжелых студий!
            CSharpCodeProvider provider = new CSharpCodeProvider();
            CompilerParameters parameters = new CompilerParameters();
            parameters.OutputAssembly = exeName;
            parameters.GenerateExecutable = true;
            
            // Подключаем системные WinForms и WebView2
            parameters.ReferencedAssemblies.Add("System.dll");
            parameters.ReferencedAssemblies.Add("System.Windows.Forms.dll");
            parameters.ReferencedAssemblies.Add("System.Drawing.dll");

            CompilerResults results = provider.CompileAssemblyFromSource(parameters, sourceCode);

            if (results.Errors.HasErrors) {
                foreach (CompilerError err in results.Errors) {
                    Console.WriteLine($"Ошибка компиляции: {err.ErrorText}");
                }
            } else {
                Console.WriteLine($"Ваш бинарник готов: {exeName}.");
            }
        }
    }
}