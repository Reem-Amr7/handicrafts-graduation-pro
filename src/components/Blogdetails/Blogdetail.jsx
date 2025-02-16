import blog1 from "../../assets/blog1 (1).jpg";
import styles from "./blogdetail.module.css";
import blog2 from "../../assets/blog12.jpg";
import user1 from '../../assets/user1.jpg';
import prof from '../../assets/Ellipse 20.png'

export default function(){
    const posts = [
        { id: 1, title: "منتج جديد", date: "October 14, 2018", image: "src/assets/product1.jpg" },
        { id: 2, title: "منتج جديد", date: "October 14, 2018", image: "src/assets/product2.jpg" },
        { id: 3, title: "منتج جديد", date: "October 14, 2018", image: "src/assets/product3.jpg" },
      ];
      const comments = [
        "محمد علي كهل يملك محلات لصنع الشاشية في المدينة العتيقة بالعاصمة تونس، ورثها أبًا عن جد. محمد كان يعمل في مصرف قبل أن يستلم إدارة محلات والده بعد أن أصبح عاجزًا عن إدارتها بمفرده.",
        "محمد علي كهل يملك محلات لصنع الشاشية في المدينة العتيقة بالعاصمة تونس، ورثها أبًا عن جد. محمد كان يعمل في مصرف قبل أن يستلم إدارة محلات والده بعد أن أصبح عاجزًا عن إدارتها بمفرده.",
      ];
    
      const categories = [
        "الخزف والفخار",
        "النسيج والتطريز",
        "المعادن",
        "الخشب",
        "الجلود",
        "الخوص والسعف",
        "الزجاج",
        "الحلي والمجوهرات",
        "الورق والخط العربي",
      ];
    return(
        <>
       <div className="flex w-full h-full   gap-96 ">
       <div className={styles.card}>
       <img src={blog1} alt="" className="h-80 w-full"/>
            <h2 className={styles.title}>الشاشية التونسية</h2>
            <span>سوق الشواشين" في المدينة العتيقة بالعاصمة تونس يجتمع فيها من احترف صنع الشاشية ، وهي قبعة حمراء اللون تصنع من الصوف ويلبسها عادة الرجال. في سنوات التسعينيات ولترويجها بعد أن شهدت تجارتها ركوداً، عمد الحرفيون على إدخال تغييرات عدة على لونها وشكلها، حتى أصبح النساء يلبسنها في الحفلات والأعراس وحتى في الأيام العادية. لكن اليوم تشهد هذه الصناعة صعوبات كبيرة على الرغم من صمودها.</span>


            <div className="block mt-28">
        <img src={blog2} alt="" className="h-80 w-full"/>
            <h2 className={styles.title}>الشاشية التونسية</h2>
<span>وتتميز الشاشية التونسية بلونها الأحمر المختلف عن مثيلاتها في البلدان المغاربية، لا سيما الشاشية الليبية ذات اللون الأسود، والشاشية التونسية قريبة من القبعة الأوروبية.
وتنتشر صناعة الشاشية  في "سوق الشواشين"، وهو عبارة عن حارة تتجمع فيها محلات صنع وبيع الشاشية. وتبدأ مراحل صنع الشاشية بزرد الصوف أي تنظيفه ونفثه، ثم صنع الكبوس أي تحديد الشكل الأولي وتلبيده لأخذ الشكل قبل معالجة الكبوس بواسطة "الكرضون" وتسمى "الكربلة"، بعدها يأتي دور صبغ الشاشية ومعالجة ثانية بواسطة "الكرضون"، وأخيراً توضع في القالب لاكتساب شكلها النهائي.</span>  
<h2 className="mt-16 ">مكانة اجتماعية</h2>    
<span className="mt-16">عادة  تلبس الشاشية في الأيام العادية من قبل المسنين لا سيما في فصل الشتاء، وأيضاً من قبل الأطفال الذكور في حفلات الختان، وتسمى "شاشية المطهر"، وجرت العادة أن ترسم عليها رسوم ورموز لطرد الحسد.
وقد تميز البايات الحسينيون بارتداء الشاشية المنمقة "شاشية البايات"، والتي تدل على مكانتهم الاجتماعية.
ويوجد أنواع عدة من الشاشية منها "الساقسلي" وهي من أشهر أنواع القبعات التونسية العريقة، تحاك بخيط واحد رقيق من الصوف، وتعود التسمية إلى أن هذا النوع كان يصنع خصيصاً لسلاطين وأمراء الدولة العثمانية.
أما "كتافي" فتحاك بخيطين من الصوف أغلظ نسبياً، فيما "عرضاوي" تحاك بثلاثة خيوط من الصوف، وتكون أطول بقليل من "الكتافي".
وتعبر الشاشية عن المكانة الاجتماعية وحتى العلمية لمن يرتديها، فكل فئة لديها نوعية خاصة بها.
وتسعى وزارة السياحة والصناعات التقليدية في تونس إلى إيجاد حلول جذرية لتنشيط قطاع الحرف التقليدية، الذي يشهد ركوداً منذ سنوات.
وقال وزير السياحة والصناعات التقليدية محمد معز بلحسين، في تصريح أدلى به في شهر مارس (آذار) الماضي، إن هدف الحكومة تمكين قطاع الصناعات التقليدية من إحداث 20 ألف موطن شغل كل سنة.
وقال خلال افتتاح صالون الابتكار في الصناعات التقليدية في دورته 38 الذي ينظمه الديوان الوطني للصناعات التقليدية بقصر المعارض في الكرم، إنه تم العام الماضي إحداث ستة آلاف موطن شغل في القطاع.</span>      
        </div>

        </div>
        
       
    <div className="text-center ml-32 mt-10" style={{ border: "2px solid #B18B5E" }}>
    <img src={prof} alt="" srcset="" className="w-40 h-40 rounded-f mr-20 mt-4" />
<h3 className="mt-2 font-bold text-center">اسم الحرف</h3>
          <p className="text-gray-500">تخصص الحرف</p>
          <div className="p-6  w-full md:w-80 ">
      <h2 className="text-xl font-bold text-center mb-4">أحدث المنشورات</h2>
      {posts.map((post) => (
        <div key={post.id} className="flex items-center justify-between mb-6">
          <div className="text-right">
            <p className="text-lg font-bold">{post.title}</p>
            <p className="text-gray-400 text-sm">{post.date}</p>
          </div>
          <img src={post.image} alt="منتج جديد" className="w-16 h-16 object-cover rounded" />
        </div>
      ))}
      <hr className="border-gray-300 mt-4 border-t-2 " />

    </div>
    <div className=" p-6 \ w-full md:w-80">
      <h2 className="text-xl font-bold text-center mb-4">أحدث التعليقات</h2>
      <div className="space-y-4 text-right">
        {comments.map((comment, index) => (
          <p key={index} className="text-gray-700 leading-relaxed">{comment}</p>
        ))}
      </div>

      <hr className="border-gray-300 my-6 border-t-2" />

      <h2 className="text-xl font-bold text-center mb-4">التصنيفات</h2>
      <ul className="text-right space-y-2">
        {categories.map((category, index) => (
          <li key={index} className="text-gray-700">
            {index + 1}. {category}
          </li>
        ))}
      </ul>
    </div>
        </div>
       </div>
        </>
    )
}